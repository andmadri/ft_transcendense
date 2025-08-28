import bcrypt from 'bcrypt';
import { addUserSessionToDB } from './sessions.js';
import { sql_log, sql_error } from './dblogger.js';

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
export async function addUserToDB(db, user) {
	const hashedPassword = await bcrypt.hash(user.password, 10);
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

export async function createNewUserToDB(db, { name, email, password, avatar_url=null }) {
	const existing = await getUserByEmail(db, email);
	if (existing) {
		sql_log(`User already exists: [${existing.id}] ${existing.name} (${existing.email})`);
		return existing.id;
	}
	return await addUserToDB(db, { name, email, password, avatar_url });
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Updates one or more fields of a user’s profile.
 *
 * Only these keys can be changed:
 *   • name
 *   • email
 *   • password (will be hashed if provided)
 *   • avatar_url
 *
 * @param {sqlite3.Database} db
 * @param {Object} userUpdates
 * @param {number} userUpdates.user_id           – the user’s ID (required)
 * @param {string} [userUpdates.name]            – new display name
 * @param {string} [userUpdates.email]           – new email address
 * @param {string} [userUpdates.password]        – new raw password
 * @param {string|null} [userUpdates.avatar_url] – new avatar URL (or empty to clear)
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} if the user doesn’t exist or no valid fields are provided.
 */
export async function updateUserInDB(db, user) {
	const existing = await getUserByID(db, user.user_id);
	if (!existing) {
		throw new Error(`User ID ${user.user_id} does not exist.`);
	}

	if (user.password !== undefined) {
		user.password = await bcrypt.hash(user.password, 10);
	}

	return new Promise((resolve, reject) => {
		const updates = [];
		const values = [];

		if (user.name !== undefined) {
			updates.push("name = ?");
			values.push(user.name);
		}
		if (user.email !== undefined) {
			updates.push("email = ?");
			values.push(user.email);
		}
		if (user.password !== undefined) {
			updates.push("password = ?");
			values.push(user.password);
		}
		if (user.avatar_url !== undefined) {
			updates.push("avatar_url = ?");
			values.push(user.avatar_url);
		}

		if (updates.length === 0) {
			console.log('No valid profile fields provided to update.');
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
				sql_log(`User updated: [${user.user_id}] ${user.name} (${user.email})`);
				resolve();
			}
		});
	});
}

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Soft-deletes a user (marks them deleted + logs them out).
 *
 * @param {sqlite3.Database} db
 * @param {number} user_id
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function deactivateUserInDB(db, user_id) {
	const existing = await getUserByID(db, user.user_id);
	if (!existing) {
		throw new Error(`User ID ${user.user_id} does not exist.`);
	}
	
	await new Promise((resolve, reject) => {
		const sql = `UPDATE Users SET is_deleted = 1, last_edited = CURRENT_TIMESTAMP WHERE id = ?`;
		db.run(sql, [user_id], function (err) {
			if (err) {
				sql_error(err, `deactivateUserInDB | id=${user.user_id} name=${existing.name} email=${existing.email}`);
				reject(err);
			} else {
				sql_log(`User deactivated: [${user.user_id}] ${existing.name} (${existing.email})`);
				resolve();
			}
		});
	});

	await addUserSessionToDB(db, { user_id, state: 'logout' });
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
		db.all(sql, [], (err, rows) => {
			if (err) {
				sql_error(err, `getOnlineUsers`);
				reject(err);
			} else {
				resolve(rows)
			}
		});
	});
}
