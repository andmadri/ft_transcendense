import sqlite3 from "sqlite3";
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
		status INTEGER DEFAULT 0,
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

export function updateStatus(email, newStatus) {
	const update = db.prepare(`
		UPDATE Users
		SET status = ?
		WHERE email = ?
	`);
	update.run(newStatus ? 1 : 0, email);
}

export function getStatus(email) {
	const query = db.prepare(`
		SELECT status FROM Users WHERE email = ?
	`);
	const row = query.get(email);
	return row ? Boolean(row.status) : null;
}

export function getUserRowByEmail(email) {
	const query = db.prepare(`
		SELECT * FROM Users WHERE email = ?
	`);
	return query.get(email); //what does query return if they can't find email?
}

export function getWins(email) {
	const query = db.prepare(`
		SELECT wins FROM Users WHERE email = ?
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

export const db = createDatabase();
