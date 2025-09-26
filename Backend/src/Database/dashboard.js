import { sql_log, sql_error } from './dblogger.js';

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
		db.all(sql, (err, rows) => {
			if (err) {
				sql_error(err, `getAllUserStateDurationsDB`);
				reject(err);
			} else {
				resolve(rows || []);
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
				if (!row) {
					sql_log(`getUserStateDurationsDB | No UserStateDuration found! user_id=${user_id}`);
				}
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
				if (!row) {
					sql_log(`getUserMatchStatsDB | No UserMatchStats found! user_id=${user_id}`);
				}
				resolve(row || null);
			}
		});
	});
}

export async function getMatchHistoryDB(db, user_id) {
	const sql = `SELECT * FROM UserMatchHistory WHERE user_id = ? ORDER BY match_ts DESC`;
	return new Promise((resolve, reject) => {
		db.all(sql, [user_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchHistoryDB | user_id=${user_id}`);
				reject(err);
			} else {
				resolve(rows || []);
			}
		});
	});
}
