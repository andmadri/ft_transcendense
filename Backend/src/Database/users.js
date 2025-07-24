import { db } from './database.js';
import bcrypt from 'bcrypt';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

/**
 * @brief Adds a new user to the SQL Users table.
 *
 * @returns {Promise<number>} - Resolves with the ID of the inserted user.
 *
 * @throws {Error} - Rejects if the insert fails (e.g., duplicate email).
 */
export async function addUserToDB(user) {
	const hashedPassword = await bcrypt.hash(user.password, 10);
	const avatar_url = user.avatar_url || null;

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO Users (name, email, password, avatar_url) VALUES (?, ?, ?, ?)`;
		db.run(sql, [user.name, user.email, hashedPassword, avatar_url], function (err) {
			if (err) {
				console.error('Error SQL - addUserToDB:', err.message);
				reject(err);
			} else {
				console.log(`User created: [${this.lastID}] ${user.name} (${user.email})`);
				resolve(this.lastID);
			}
		});
	});
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Retrieves a user by ID from the Users table.
 *
 * @param {number} id - The user ID to look up.
 * @returns {Promise<Object|null>} - Resolves with user data or null if not found.
 */
export async function getUserByID(id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Users WHERE id = ?`;
		db.get(sql, [id], (err, row) => {
			if (err) {
				console.error('Error SQL - getUserByID:', err.message);
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
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

export async function isOnline(email) {
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
			// SECET names and avatar of online users only
			`SELECT name, avatar_url FROM Users WHERE online_status = 0 OR online_status = 1`,
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