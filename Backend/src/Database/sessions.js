import { getUserByID } from './users.js';
import { sql_log, sql_error } from './dblogger.js';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

/**
 * @brief Adds a new session record for a user in the UserSessions table.
 *
 * @param {Object} session - The session data.
 * @param {number} session.user_id - The ID of the user.
 * @param {string} session.state - The session state (Accepts only 'login', 'in_menu', 'in_lobby', 'in_game', 'logout').
 *
 * @returns {Promise<number>} - Resolves with the inserted session ID.
 *
 * @throws {Error} - If insertion fails.
 */
export async function addUserSessionToDB(db, session) {
	let user = null;
	try {
		user = await getUserByID(db, session.user_id);
		if (!user) {
			throw new Error(`User ID ${session.user_id} does not exist.`);
		}
	} catch (err) {
		return err;
	}

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO UserSessions (user_id, state) VALUES (?, ?)`;
		db.run(sql, [session.user_id, session.state], function (err) {
			if (err) {
				sql_error(err, `addUserSessionToDB | user_id=${user.id} state=${session.state}`);
				reject(err);
			} else {
				sql_log(`Session created: [${this.lastID}] ${user.name} -> ${session.state}`);
				resolve(this.lastID);
			}
		});
	});
}

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

export async function getLastUserSession(db, user_id) {
	console.log(`Userid last user session ${user_id}`);
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM UserSessions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1`;
		db.get(sql, [user_id], (err, row) => {
			if (err) {
				sql_error(err, `getLastUserSession | user_id=${user_id}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getLastUserSession | No UserSession found! user_id=${user_id}`);
				}
				resolve(row || null);
			}
		});
	});
}

export async function getLatestSessionByState(db, user_id, state) {
	const allowedStates = Array.isArray(state) ? state : [state];
	const placeholders = allowedStates.map(() => '?').join(', ');
	
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM UserSessions WHERE user_id = ? AND state IN (${placeholders}) ORDER BY timestamp DESC LIMIT 1`;
		db.get(sql, [user_id, ...allowedStates], (err, row) => {
			if (err) {
				sql_error(err, `getLatestSessionByState | user_id=${user_id} state=${state}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getLatestSessionByState | No UserSession found with state: ${state}! user_id=${user_id}`);
				}
				resolve(row || null);
			}
		});
	});
}
