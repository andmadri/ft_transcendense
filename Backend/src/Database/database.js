import { db } from '../index.js'
import sqlite3 from "sqlite3";
import fs from "fs";
import bcrypt from 'bcrypt';

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

export function addUserToDB(msg) {
	const hashedPassword = bcrypt.hashSync(msg.password, 10);

	db.run(
		`INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`,
		[msg.name, msg.email, hashedPassword],
		function (err) {
			if (err)
				console.error("Insert error:", err.message);
		}
	);
}

export function getUserByEmail(email, callback) {
	db.get(
		`SELECT * FROM Users WHERE email = ?`,
		[email],
		(err, row) => {
			if (err) {
				console.error("Query error:", err.message);
				callback(null);
			} else
				callback(row);
		}
	);
}

export function createDatabase() {
	const existDb = fs.existsSync(dbpath);
	const db = new Database(dbpath, (err) => {
		if (err)
			return console.error('Error openinig database:', err.message);

		console.log('Connected to the database.');
		db.run("PRAGMA foreign_keys = ON");
		if (!existDb) {
			console.log('Created database tables.');
			createTables(db);
		}
	});
	return db;
}

export function updateOnlineStatus(email, newStatus) {
	db.run(
		`UPDATE Users SET online_status = ? WHERE email = ?`,
		[newStatus ? 1 : 0, email],
		function(err) {
			if (err)
				console.error("Update error:", err.message);
		}
	);
}

export function isOnline(email, callback) {
	db.get(
		`SELECT online_status FROM Users WHERE email = ?`,
		[email],
		(err, row) => {
			if (err) {
				console.error("Query error:", err.message);
				callback(false);
				return;
			}
			callback(Boolean(row ? row.online_status : 0));
		}
	);
}

export function userAlreadyExist(email, callback) {
	db.get(
		`SELECT EXISTS(SELECT 1 FROM Users WHERE email = ?) AS row_exists`,
		[email],
		(err, row) => {
			if (err) {
				console.error("Query error:", err.message);
				callback(false);
			} else
				callback(row.row_exists === 1);
		}
	);
}


export function getWins(email, callback) {
	db.get(
		`SELECT wins FROM Users WHERE email = ?`,
		[email],
		(err, row) => {
			if (err) {
				console.error("Query error:", err.message);
				callback(null);
				return;
			}
			callback(row ? row.wins : 0);
		}
	);
}

export function getLosses(email, callback) {
	db.get(
		`SELECT losses FROM Users WHERE email = ?`,
		[email],
		(err, row) => {
			if (err) {
				console.error("Query error:", err.message);
				callback(null);
				return;
			}
			callback(row ? row.losses : 0);
		}
	);
}

// export function getUserId() {
// }

export function updateWins(email) {
	getWins(email, (wins) => {
		db.run(
			`UPDATE Users SET wins = ? WHERE email = ?`,
			[wins + 1, email],
			function(err) {
				if (err)
					console.error("Update error:", err.message);
			}
		);
	});
}

export function updateLosses(email) {
	getLosses(email, (losses) => {
		db.run(
			`UPDATE Users SET losses = ? WHERE email = ?`,
			[losses + 1, email],
			function(err) {
				if (err)
					console.error("Update error:", err.message);
			}
		);
	});
}

export function addFriend(user_id, friend_id) {
	db.run(
		`INSERT INTO Friends (user_id, friend_id) VALUES (?, ?)`,
		[user_id, friend_id],
		function (err) {
			if (err)
				console.error("Insert error:", err.message);
		}
	)
}

export function deleteFriend(user_id, friend_id) {
	db.run(
		`DELETE FROM Friends WHERE user_id = ? AND friend_id = ?`,
		[user_id, friend_id],
		function (err) {
			if (err) {
				console.error("Delete error:", err.message);
			}
		}
	)
}

// all wins - losses = points? only for the online version?
// export function getHighscores(callback) {
// 	db.run(
// 		`SELECT `
// 	)
// }

