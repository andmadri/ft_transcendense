import { sql_log, sql_error } from './dblogger.js';

// *************************************************************************** //
//                        VIEW DATA FROM SQL VIEW TABLE                        //
// *************************************************************************** //

export async function getMatchGoalsSummaryByMatchID(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchGoalsSummaryByMatchID id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchGoalsSummaryByMatchID | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvents rows needed for making the scatter plot.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered goal data or null.
 */
export async function getMatchScatterDB(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT user_id, ball_x, ball_y FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchScatterDB id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchScatterDB | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvents rows needed for making the line graph.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered for line graph or null.
 */
export async function getMatchLineDB(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT goal, user_id, duration FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchLineDB id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchLineDB | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvents rows needed for making the bar chart.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered for bar chart or null.
 */
export async function getMatchBarDB(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT goal, user_id, hits FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchBarDB id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchBarDB | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}
