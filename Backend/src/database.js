import sqlite3 from "sqlite3";
import fs from "fs";
import { db } from './index.js'

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

	//this can't happen until the you send a friends request
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

	//this can't happen until the first match
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

export function createDatabase() {
	const existDb = fs.existsSync(dbpath);
	const db = new Database(dbpath, (err) => {
		if (err) {
			return console.error('Error openinig database:', err.message);
		}
		console.log('Connected to the database.');
		db.run("PRAGMA foreign_keys = ON");
		if (!existDb)
		{
			console.log('Created database tables.');
			createTables(db);
		}
	});
	return db;
}

export function updateOnlineStatus(email, newStatus) {
	const update = db.prepare(`
		UPDATE Users
		SET online_status = ?
		WHERE email = ?
	`);
	update.run(newStatus ? 1 : 0, email);
}

export function isOnline(email) {
	const query = db.prepare(`
		SELECT online_status FROM Users WHERE email = ?
	`);
	const row = query.get(email);
	return Boolean(row.online_status);
}

export async function userAlreadyExist(email)
{
	const query = db.prepare(`
		SELECT EXISTS(SELECT 1 FROM Users WHERE email = ?) AS row_exists;
	`);
	const result = query.get(email);
	return result.row_exists === 1;
	}

export function getUserRowByEmail(email) {
	const query = db.prepare(`
		SELECT * FROM Users WHERE email = ?
	`);
	return query.get(email);
}

export function getWins(email) {
	const query = db.prepare(`
		SELECT wins FROM Users 
		WHERE email = ?
	`)
	const row = query.get(email);
	return row.wins;
}

export function getLooses(email) {
	const query = db.prepare(`
		SELECT losses FROM Users WHERE email = ?
	`)
	const row = query.get(email);
	return row.losses;
}

// export function getUserId() {
// }

export function updateWins(email) {
	const update = db.update(`
		UPDATE Users
		SET wins = ?
		WHERE email = ?
	`);
	const wins = getWins(email);
	update.run(wins + 1, email);
}

export function updateLosses(email) {
	const update = db.update(`
		UPDATE Users
		SET losses = ?
		WHERE email = ?
	`);
	const wins = getWins(email);
	update.run(losses + 1, email);
}

// export function addFriend(user_id, friend_id) {
// 	const 
// }

// export function deleteFriend() {

// }


