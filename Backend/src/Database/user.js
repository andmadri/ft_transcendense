import { db } from '../index.js'
import bcrypt from 'bcrypt';

export async function addUserToDB(msg) {
	const hashedPassword = await bcrypt.hash(msg.password, 10);

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`,
			[msg.name, msg.email, hashedPassword],
			(err) => {
				if (err)
					reject(err);
				else
					resolve();
			}
		);
	})
}

export async function getUserByEmail(email) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT * FROM Users WHERE email = ?`,
			[email],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve(row);
			}
		);
	});
}

export async function getUserByID(id) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT * FROM Users WHERE id = ?`,
			[id],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve(row);
			}
		);
	});
}

export async function updateOnlineStatus(email, newStatus) {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE Users SET online_status = ? WHERE email = ?`,
			[newStatus ? 1 : 0, email],
			(err) => {
				if (err)
					reject(err);
				else
					resolve();
			}
		);
	})
}

export async function getOnlineState(email) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT online_status FROM Users WHERE email = ?`,
			[email],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve(Boolean(row ? row.online_status : 0));
			}
		);
	})
}

export async function getOnlineUsers() {
	return new Promise((resolve, reject) => {
		db.all(
			`SELECT name, avatar_url FROM Users WHERE online_status = 1`,
			[],
			(err, rows) => {
				if (err)
					reject(err);
				else
					resolve(rows);
			}
		);
	});
}

export async function userAlreadyExist(email) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT EXISTS(SELECT 1 FROM Users WHERE email = ?) AS row_exists`,
			[email],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve(row.row_exists === 1);
			}
		);
	})
}


export async function getWins(email) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT wins FROM Users WHERE email = ?`,
			[email],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve(row ? row.wins : 0);
			}
		);
	})
}

export async function getLosses(email) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT losses FROM Users WHERE email = ?`,
			[email],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve(row ? row.losses : 0);
			}
		);
	})
}

export async function updateWins(email) {
	let	wins;

	try {
		wins = await getWins(email);
	} catch(err) {
		return ;
	}
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE Users SET wins = ? WHERE email = ?`,
			[wins + 1, email],
			(err) => {
				if (err)
					reject(err);
				else
					resolve();
			}
		);
	});
}

export async function updateLosses(email) {
	let	losses;

	try {
		losses = await getLosses(email);
	} catch(err) {
		return ;
	}
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE Users SET losses = ? WHERE email = ?`,
			[losses + 1, email],
			(err) => {
				if (err)
					reject(err);
				else
					resolve();
			}
		);
	})
}