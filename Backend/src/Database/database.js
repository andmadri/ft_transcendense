import { db } from '../index.js'
import sqlite3 from "sqlite3";
import fs from "fs";


const { Database } = sqlite3.verbose();
const dbpath = './pong.db';

function createTables(db) {
	db.exec(`
	CREATE TABLE Users
	(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(20) NOT NULL,
		email VARCHAR(254) NOT NULL UNIQUE,
		password TEXT NOT NULL,
		avatar_url TEXT,
		online_status INTEGER DEFAULT 0,
		wins INTEGER DEFAULT 0,
		losses INTEGER DEFAULT 0
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
		player_1_score INTEGER DEFAULT 0,
		player_2_score INTEGER DEFAULT 0,
		date VARCHAR(11) NOT NULL,
		FOREIGN KEY(player_1_id) REFERENCES Users(id),
		FOREIGN KEY(player_2_id) REFERENCES Users(id)
	);
	`);
}

export async function createDatabase() {
	const existDb = fs.existsSync(dbpath);
	const newdDB = new Database(dbpath, (err) => {
		if (err)
			return console.error('Error openinig database:', err.message);

		console.log('Connected to the database.');
		newdDB.run("PRAGMA foreign_keys = ON");
		if (!existDb) {
			console.log('Created database tables.');
			createTables(newdDB);
		}
	});
	return newdDB;
}
