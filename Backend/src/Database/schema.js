/**
 * @brief Creates all tables in the database if they do not exist.
 *
 * @param {sqlite3.Database} db - The active SQLite database instance.
 */
function createTables(db)
{
	db.exec(`
	CREATE TABLE IF NOT EXISTS Users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		avatar_url TEXT,
		wins INTEGER DEFAULT 0,
		losses INTEGER DEFAULT 0,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
		UNIQUE(user_id, friend_id)
	);

	CREATE TABLE IF NOT EXISTS Matches (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		player_1_id INTEGER NOT NULL,
		player_2_id INTEGER,
		winner_id INTEGER,
		match_type TEXT NOT NULL CHECK (state IN ('1v1', 'vs_ai', 'tournament')),
		start_time TEXT DEFAULT CURRENT_TIMESTAMP,
		end_time TEXT,
		player_1_score INTEGER DEFAULT 0,
		player_2_score INTEGER DEFAULT 0,
		FOREIGN KEY(player_1_id) REFERENCES Users(id),
		FOREIGN KEY(player_2_id) REFERENCES Users(id),
		FOREIGN KEY(winner_id) REFERENCES Users(id),
		UNIQUE(player_1_id, player_2_id)
	);

	CREATE TABLE IF NOT EXISTS MatchEvents (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		match_id INTEGER NOT NULL,
		player_1_id INTEGER NOT NULL,
		player_2_id INTEGER NOT NULL,
		timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
		event_type TEXT NOT NULL,
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
		FOREIGN KEY(player_1_id) REFERENCES Users(id),
		FOREIGN KEY(player_2_id) REFERENCES Users(id)
	);
	`, (err) => {
		if (err) return console.error("Error creating tables:", err);
		console.log("Created database tables.");
		db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, rows) => {
			if (err) console.error("Failed to list tables:", err);
			else console.log("Current tables in database:", rows.map(r => r.name));
		});
	});
}
