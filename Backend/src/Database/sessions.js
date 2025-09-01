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
	const user = await getUserByID(db, session.user_id);
	if (!user) {
		throw new Error(`User ID ${session.user_id} does not exist.`);
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
				resolve(row || null);
			}
		});
	});
}

// *************************************************************************** //
//                         VIEW DATA FROM VIEW TABLES                          //
// *************************************************************************** //

const _baseStatsQuery = `SELECT u.id AS user_id, u.name,
							COALESCE(s.login_secs, 0) AS login_secs,
							COALESCE(s.menu_secs, 0) AS menu_secs,
							COALESCE(s.lobby_secs, 0) AS lobby_secs,
							COALESCE(s.game_secs, 0) AS game_secs
						FROM Users u LEFT JOIN UserStateDurations s
						ON u.id = s.user_id`;

/**
 * @brief Returns total seconds each user has spent in each state.
 *
 * @param {sqlite3.Database} db
 * @returns {Promise<Array<{user_id:number,name:string,
 *                        login_secs:number,menu_secs:number,
 *                        lobby_secs:number,game_secs:number}>>}
 */
export function getAllUserStateDurationsDB(db) {
	const sql = _baseStatsQuery + ` ORDER BY u.name`;
	return new Promise((resolve, reject) => {
		db.all(sql, [], (err, rows) => {
			if (err) {
				sql_error(err, `getAllUserStateDurationsDB`);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

/**
 * @brief Returns total seconds for one user has spent in each state.
 *
 * @param {sqlite3.Database} db
 * @returns {Promise<Array<{user_id:number,name:string,
 *                        login_secs:number,menu_secs:number,
 *                        lobby_secs:number,game_secs:number}>>}
 */
export function getUserStateDurationsDB(db, user_id) {
	const sql = _baseStatsQuery + ` WHERE u.id = ?`;
	return new Promise((resolve, reject) => {
		db.get(sql, [user_id], (err, row) => {
			if (err) {
				sql_error(err, `getUserStateDurationsDB | user_id=${user_id}`);
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
}

export function getUserMatchStatsDB(db, user_id) {
	const sql = `SELECT * FROM UserMatchStats WHERE user_id = ?`;
	return new Promise((resolve, reject) => {
		db.get(sql, [user_id], (err, row) => {
			if (err) {
				sql_error(err, `getUserMatchStatsDB | user_id=${user_id}`);
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
}

