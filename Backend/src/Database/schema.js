import { sql_log, sql_error } from './dblogger.js';

/**
 * @brief Creates all tables in the database if they do not exist.
 *
 * @param {sqlite3.Database} db - The active SQLite database instance.
 */
export async function createTables(db)
{
	const sql = `
	BEGIN;

	CREATE TABLE IF NOT EXISTS Users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		twofa_secret TEXT,
		twofa_active INTEGER NOT NULL DEFAULT 0,
		avatar_url TEXT,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		last_edited TEXT DEFAULT CURRENT_TIMESTAMP,
		CHECK(twofa_active IN (0,1))
	);

	CREATE TABLE IF NOT EXISTS UserSessions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		state TEXT NOT NULL CHECK (state IN ('login', 'in_menu', 'in_lobby', 'in_game', 'logout')),
		timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES Users(id)
	);

	CREATE TABLE IF NOT EXISTS Friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		friend_id INTEGER NOT NULL,
		accepted INTEGER DEFAULT 0,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES Users(id),
		FOREIGN KEY(friend_id) REFERENCES Users(id),
		UNIQUE(user_id, friend_id),
		CHECK(user_id <> friend_id)
	);

	CREATE TABLE IF NOT EXISTS Matches (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		player_1_id INTEGER NOT NULL,
		player_2_id INTEGER NOT NULL,
		winner_id INTEGER,
		match_type TEXT NOT NULL CHECK (match_type IN ('1v1', 'vs_ai', 'vs_guest', 'tournament')),
		start_time TEXT DEFAULT CURRENT_TIMESTAMP,
		end_time TEXT,
		player_1_score INTEGER DEFAULT 0,
		player_2_score INTEGER DEFAULT 0,
		FOREIGN KEY(player_1_id) REFERENCES Users(id),
		FOREIGN KEY(player_2_id) REFERENCES Users(id),
		FOREIGN KEY(winner_id) REFERENCES Users(id),
		CHECK(player_1_id <> player_2_id)
	);

	CREATE TABLE IF NOT EXISTS MatchEvents (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		match_id INTEGER NOT NULL,
		user_id INTEGER,
		timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
		event_type TEXT NOT NULL CHECK (event_type IN ('serve', 'goal', 'hit')),
		ball_x REAL,
		ball_y REAL,
		paddle_x_player_1 REAL,
		paddle_y_player_1 REAL,
		paddle_x_player_2 REAL,
		paddle_y_player_2 REAL,
		FOREIGN KEY(match_id) REFERENCES Matches(id),
		FOREIGN KEY(user_id) REFERENCES Users(id)
	);

	CREATE VIEW IF NOT EXISTS OnlineUsers AS
		SELECT u.id, u.name
		FROM Users AS u
		JOIN (
			SELECT user_id, state
			FROM UserSessions
			WHERE id IN (SELECT MAX(id) FROM UserSessions GROUP BY user_id)
		) AS s ON u.id = s.user_id
		WHERE s.state != 'logout';
	
	CREATE VIEW IF NOT EXISTS UserStateDurations AS 
		WITH sessions AS (
			SELECT
				user_id,
				state,
				timestamp AS start_ts,
				COALESCE(
					LEAD(timestamp) OVER (PARTITION BY user_id ORDER BY timestamp),
					CURRENT_TIMESTAMP
				)
			AS end_ts FROM UserSessions
		)
		SELECT user_id, 
		ROUND(
			SUM(CASE WHEN state IN ('in_menu', 'in_lobby', 'in_game') THEN (julianday(end_ts) - julianday(start_ts)) * 86400
			ELSE 0 END), 0) AS login_secs,
		ROUND(
			SUM(CASE WHEN state = 'in_menu'	THEN (julianday(end_ts) - julianday(start_ts)) * 86400
			ELSE 0 END), 0) AS menu_secs,
		ROUND(
			SUM(CASE WHEN state = 'in_lobby' THEN (julianday(end_ts) - julianday(start_ts)) * 86400
			ELSE 0 END), 0) AS lobby_secs,
		ROUND(
			SUM(CASE WHEN state = 'in_game' THEN (julianday(end_ts) - julianday(start_ts)) * 86400
			ELSE 0 END), 0) AS game_secs
		FROM sessions GROUP BY user_id;

	CREATE VIEW IF NOT EXISTS UserMatchStats AS
		SELECT	u.id AS user_id,
				u.name AS name,
				COUNT(m.id) AS total_matches,
				SUM(CASE WHEN m.winner_id = u.id THEN 1 ELSE 0 END) AS wins,
				SUM(CASE WHEN m.winner_id != u.id AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END) AS losses,
				ROUND(
					CASE WHEN COUNT(m.id) > 0 THEN 100.0 * SUM(CASE WHEN m.winner_id = u.id THEN 1 ELSE 0 END) / COUNT(m.id)
					ELSE 0 END, 1) AS win_rate,
				ROUND(
					AVG(CASE WHEN u.id = m.player_1_id THEN m.player_1_score
					ELSE m.player_2_score END), 1) AS avg_score,
				ROUND(
					AVG(CASE WHEN u.id = m.player_1_id THEN m.player_2_score
					ELSE m.player_1_score END), 1) AS avg_opp_score,
				ROUND(
					AVG((julianday(m.end_time) - julianday(m.start_time)) * 86400), 0) AS avg_duration
		FROM Users u LEFT JOIN Matches m ON (m.player_1_id = u.id OR m.player_2_id = u.id) AND m.end_time IS NOT NULL GROUP BY u.id;

	CREATE VIEW IF NOT EXISTS MatchGoalsSummary AS
		WITH ordered AS (
			SELECT
				e.*,
				SUM(CASE WHEN e.event_type = 'serve' THEN 1 ELSE 0 END)
				OVER (PARTITION BY e.match_id ORDER BY e.timestamp ASC, e.id ASC) AS rally_id,
				MIN(e.timestamp) OVER (PARTITION BY e.match_id) AS first_ts
			FROM MatchEvents e
		),
		goals AS (
			SELECT
				o.match_id,
				o.id AS event_id,
				o.user_id,
				o.rally_id,
				o.timestamp,
				o.ball_x,
				o.ball_y,
				o.first_ts,
				ROW_NUMBER() OVER (PARTITION BY o.match_id ORDER BY o.timestamp ASC, o.id ASC) AS goal_no
			FROM ordered o
			WHERE o.event_type = 'goal'
		),
		hits_per_rally AS (
			SELECT
				match_id,
				rally_id,
				COUNT(*) AS hits
			FROM ordered
			WHERE event_type = 'hit'
			GROUP BY match_id, rally_id
		)
		SELECT
			g.match_id,
			g.goal_no AS goal,
			g.user_id,
			u.name AS username,
			COALESCE(h.hits, 0) AS hits,
			g.timestamp,
			ROUND( (julianday(g.timestamp) - julianday(g.first_ts)) * 86400, 0 ) AS duration,
			ROUND(g.ball_x, 3) AS ball_x,
			ROUND(g.ball_y / 0.75, 3) AS ball_y
		FROM goals g JOIN Users u ON u.id = g.user_id
		LEFT JOIN hits_per_rally h ON h.match_id = g.match_id AND h.rally_id = g.rally_id
		ORDER BY g.match_id, g.goal_no;

	CREATE VIEW IF NOT EXISTS UserMatchHistory AS
		SELECT
			m.id AS match_id,
			p1.id AS user_id,
			p2.id AS opponent_id,
			p2.name AS opponent_name,
			m.start_time AS match_ts,
			strftime('%d-%m-%Y', m.start_time) AS date,
			strftime('%H:%M', m.start_time) AS time,
			m.winner_id,
			w.name AS winner_name,
			m.player_1_score AS my_score,
			m.player_2_score AS opp_score,
			ROUND((julianday(m.end_time) - julianday(m.start_time)) * 86400, 0) AS duration_secs,
			(
				SELECT COUNT(*)
				FROM MatchEvents e
				WHERE e.match_id = m.id AND e.event_type = 'hit'
			)	AS total_hits
			FROM Matches m
			JOIN Users p1 ON p1.id = m.player_1_id
			JOIN Users p2 ON p2.id = m.player_2_id
			LEFT JOIN Users w ON w.id = m.winner_id
			WHERE m.end_time IS NOT NULL

		UNION ALL

		SELECT
			m.id AS match_id,
			p2.id AS user_id,
			p1.id AS opponent_id,
			p1.name AS opponent_name,
			m.start_time AS match_ts,
			strftime('%d-%m-%Y', m.start_time) AS date,
			strftime('%H:%M', m.start_time) AS time,
			m.winner_id,
			w.name AS winner_name,
			m.player_2_score AS my_score,
			m.player_1_score AS opp_score,
			ROUND((julianday(m.end_time) - julianday(m.start_time)) * 86400, 0) AS duration_secs,
			(
				SELECT COUNT(*)
				FROM MatchEvents e
				WHERE e.match_id = m.id AND e.event_type = 'hit'
			)	AS total_hits
			FROM Matches m
			JOIN Users p1 ON p1.id = m.player_1_id
			JOIN Users p2 ON p2.id = m.player_2_id
			LEFT JOIN Users w ON w.id = m.winner_id
			WHERE m.end_time IS NOT NULL;
	COMMIT;
	`;

	return new Promise((resolve, reject) => {
		db.exec(sql, (err) => {
			if (err) {
				sql_error(err, `Error creating tables`);
				return reject(err);
			}
			sql_log(`Created database tables and views.`);
			db.all(`SELECT name, type FROM sqlite_schema WHERE type IN ('table','view') ORDER BY name`, (err, rows) => {
				if (err) {
					sql_error(e, "Failed to list schema objects");
				} else {
					sql_log(`Current objects: ${rows.map(r => `${r.type}:${r.name}`).join(', ')}`);
					resolve();
				}
			});
		});
	});
}
