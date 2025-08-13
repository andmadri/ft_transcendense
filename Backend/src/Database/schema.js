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
		avatar_url TEXT,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP,
		last_edited TEXT DEFAULT CURRENT_TIMESTAMP,
		is_deleted INTEGER NOT NULL DEFAULT 0
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
		user_id INTEGER NOT NULL,
		timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
		event_type TEXT NOT NULL CHECK (event_type IN ('serve', 'goal', 'hit')),
		ball_x REAL,
		ball_y REAL,
		ball_angle REAL,
		ball_result_x REAL,
		ball_result_y REAL,
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
