// /**
//  * @brief Returns the list of currently online users (id + name).
//  */
// export function getOnlineUsers(db) {
// 	const sql = `SELECT * FROM OnlineUsers ORDER BY name`;
// 	return new Promise((resolve, reject) => {
// 		db.all(sql, [], (err, rows) => {
// 			if (err) {
// 				reject(err);
// 			} else {
// 				resolve(rows)
// 			}
// 		});
// 	});
// }

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
export function getAllUserStateDurations(db) {
	const sql = _baseStatsQuery + ` ORDER BY u.name`;
	return new Promise((resolve, reject) => {
		db.all(sql, [], (err, rows) => {
			if (err) {
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
export function updateOnlineStatusgetUserStateDurations(db, user_id) {
	const sql = _baseStatsQuery + ` WHERE u.id = ?`;
	return new Promise((resolve, reject) => {
		db.get(sql, [user_id], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
}
