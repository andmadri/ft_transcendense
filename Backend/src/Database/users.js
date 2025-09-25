import bcrypt from 'bcrypt';
import { sql_log, sql_error } from './dblogger.js';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

export function nameAlreadyExist(db, name) {
	const username = name.toLowerCase(); 

	return new Promise((resolve, reject) => {
		const sql = `SELECT 1 FROM Users WHERE LOWER(name) = ? LIMIT 1`;
		db.get(sql,	[username], (err, row) => {
			if (err) {
				sql_error(err, `nameAlreadyExist | name=${name}`);
				return reject(err);
			} else {
				if (row) {
					sql_log(`Name already exist: ${name}`);
				}
				resolve(row || null);
			}
		});
	});
	if (exists)
		console.log("Username already exists");
	return (exists);
}

export async function emailAlreadyExist(db, emailadress) {
	const email = emailadress.toLowerCase(); 

	const exists = await new Promise((resolve, reject) => {
		db.get(`SELECT 1 FROM Users WHERE LOWER(email) = ? LIMIT 1`,
			[email], (err, row) => {
			if (err)
				return reject(err);
			resolve(!!row);
		});
	});
	if (exists)
		console.log("Email already exists");
	return (exists);
}

/**
 * @brief Adds a new user to the SQL Users table.
 *
 * @returns {Promise<number>} - Resolves with the ID of the inserted user.
 *
 * @throws {Error} - Rejects if the insert fails (e.g., duplicate email).
 */
export async function addUserToDB(db, user) {
	const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : null;
	const avatar_url = user.avatar_url || null;

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO Users (name, email, password, avatar_url) VALUES (?, ?, ?, ?)`;
		db.run(sql, [user.name, user.email, hashedPassword, avatar_url], function (err) {
			if (err) {
				sql_error(err, `addUserToDB | name=${user.name} email=${user.email}`);
				reject(err);
			} else {
				sql_log(`User created: [${this.lastID}] ${user.name} (${user.email})`);
				resolve(this.lastID);
			}
		});
	});
}

export async function createNewUserToDB(db, user = {}) {
	const { name, email, password, avatar_url = null } = user;
	if (!name || !email) {
		throw new Error("createNewUserToDB: 'name' and 'email' are required");
	}
	return await addUserToDB(db, { name, email, password, avatar_url });
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Updates one or more fields of a user’s profile.
 *
 * @param {sqlite3.Database} db
 * @param {Object} userUpdates
 * @param {number} userUpdates.user_id           – the user’s ID (required)
 * @param {string} [userUpdates.name]            – new display name
 * @param {string} [userUpdates.email]           – new email address
 * @param {string} [userUpdates.password]        – new raw password
 * @param {string} [userUpdates.twofa_secret]    – set or now 2FA secret
 * @param {string} [userUpdates.twofa_active]    – activate or disable 2FA
 * @param {string|null} [userUpdates.avatar_url] – new avatar URL (or empty to clear)
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} if the user doesn’t exist or no valid fields are provided.
 */
export async function updateUserInDB(db, user) {
	let existing = null;
	try {
		existing = await getUserByID(db, user.user_id);
		if (!existing) {
			throw new Error(`User ID ${user.user_id} does not exist.`);
		}

		if (user.password !== undefined) {
			user.password = await bcrypt.hash(user.password, 10);
		}
	} catch (err) {
		return err;
	}
	return new Promise((resolve, reject) => {
		const updates = [];
		const values = [];
		const changes = [];

		if (user.name !== undefined) {
			updates.push("name = ?");
			values.push(user.name);
			changes.push(`name = ${user.name}\n`);
		}
		if (user.email !== undefined) {
			updates.push("email = ?");
			values.push(user.email);
			changes.push(`email = ${user.email}\n`);
		}
		if (user.password !== undefined) {
			updates.push("password = ?");
			values.push(user.password);
			changes.push(`password = ${user.password}\n`);
		}
		if (user.twofa_secret !== undefined) {
			updates.push("twofa_secret = ?");
			values.push(user.twofa_secret);
			changes.push(`twofa_secret = ${user.twofa_secret}\n`);
		}
		if (user.twofa_active !== undefined) {
			updates.push("twofa_active = ?");
			values.push(user.twofa_active);
			changes.push(`twofa_active = ${user.twofa_active}\n`);
		}
		if (user.avatar_url !== undefined) {
			updates.push("avatar_url = ?");
			values.push(user.avatar_url);
			changes.push(`avatar_url = ${user.avatar_url}\n`);
		}

		if (updates.length === 0) {
			console.warn('UPDATE_WARNING', 'No valid match fields provided to update', 'updateUserInDB');
			return resolve();
		}

		updates.push("last_edited = CURRENT_TIMESTAMP");

		const sql = `UPDATE Users SET ${updates.join(", ")} WHERE id = ?`;
		values.push(user.user_id);

		db.run(sql, values, function (err) {
			if (err) {
				sql_error(err, `updateUserInDB | id=${user.user_id} name=${existing.name} email=${existing.email}`);
				reject(err);
			} else {
				sql_log(`User updated: [${user.user_id}] ${existing.name} | Number of changes=${this.changes}\n${changes}`);
				resolve(this.changes);
			}
		});
	});
}

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Retrieves a user by ID from the Users table.
 *
 * @param {number} user_id - The user ID to look up.
 * @returns {Promise<Object|null>} - Resolves with user data or null if not found.
 */
export async function getUserByID(db, user_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Users WHERE id = ?`;
		db.get(sql, [user_id], (err, row) => {
			if (err) {
				sql_error(err, `getUserByID | id=${user_id}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getUserByID | user_id not found! user_id=${user_id}`);
				}
				resolve(row || null);
			}
		});
	});
}

/**
 * @brief Retrieves a user by ID from the Users table.
 *
 * @param {number} user_id - The user ID to look up.
 * @returns {Promise<Object|null>} - Resolves with user data or null if not found.
 */
export async function getUserByEmail(db, email) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Users WHERE email = ?`;
		db.get(sql, [email], (err, row) => {
			if (err) {
				sql_error(err, `getUserByEmail | email=${email}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getUserByEmail | email not found! email=${email}`);
				}
				resolve(row || null);
			}
		});
	});
}

// *************************************************************************** //
//                         VIEW DATA FROM VIEW TABLES                          //
// *************************************************************************** //

/**
 * @brief Returns the list of currently online users (id + name).
 */
export function getOnlineUsers(db) {
	const sql = `SELECT * FROM OnlineUsers ORDER BY name`;
	return new Promise((resolve, reject) => {
		db.all(sql, (err, rows) => {
			if (err) {
				sql_error(err, `getOnlineUsers`);
				reject(err);
			} else {
				resolve(rows)
			}
		});
	});
}

export async function getAllPlayers(db) {
	const sql = `
		SELECT 
			u.*,
			CASE 
				WHEN us.state IS NULL OR us.state = 'logout' THEN 0
				ELSE 1
			END AS online_status
		FROM Users u
		LEFT JOIN (
			SELECT us1.user_id, us1.state
			FROM UserSessions us1
			WHERE us1.id = (
				SELECT us2.id
				FROM UserSessions us2
				WHERE us2.user_id = us1.user_id
				ORDER BY us2.timestamp DESC
				LIMIT 1
			)
		) us ON u.id = us.user_id
		ORDER BY u.name;
	`;
	return new Promise((resolve, reject) => {
		db.all(sql, (err, rows) => {
			if (err) {
				sql_error(err, `getAllPlayers`);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}
