import sqlite3 from "sqlite3";
const { Database } = sqlite3.verbose();
const dbpath = './db/pong.db';

function createTables(db) {
	db.exec(`
	CREATE TABLE Users
	(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(20) NOT NULL,
		email VARCHAR(50) NOT NULL UNIQUE,
		avatar_url TEXT,
		wins INTEGER DEFAULT 0,
		looses INTEGER DEFAULT 0

	);
	`);

	db.exec(`
	CREATE TABLE Friends
	(
		user_id INTEGER,
		friend_id INTEGER,
		FOREIGN KEY(user_id) REFERENCES Users(id),
		FOREIGN KEY(friend_id) REFERENCES Users(id),
		UNIQUE(user_id, friend_id)
	);
	`);

	db.exec(`
	CREATE TABLE Matches
	(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		player_1_id INTEGER,
		player_2_id INTEGER,
		FOREIGN KEY(player_1_id) REFERENCES Users(id),
		FOREIGN KEY(player_2_id) REFERENCES Users(id),
		player_1_score INTEGER DEFAULT 0,
		player_2_score INTEGER DEFAULT 0,
		date VARCHAR(11) NOT NULL
	);
	`);
}

function createDatabase() {
	const db = new Database(dbpath, (err) => {
		if (err) {
			return console.error('Error openinig database:', err.message);
		}
		console.log('Connected to the database.');
		db.run("PRAGMA foreign_keys = ON");
		createTables(db);
	});
	return db;
}

export const db = createDatabase();
