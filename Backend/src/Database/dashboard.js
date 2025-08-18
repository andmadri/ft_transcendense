import { sql_log, sql_error } from './dblogger.js';

export async function getMatchHistoryDB(db, user_id, limit = 50, offset = 0) {
	const sql = `SELECT opponent_name AS opponent, date, time, 
					CASE
						WHEN winner_id = user_id THEN 'me'
						WHEN winner_id = opponent_id THEN opponent_name
						ELSE NULL
					END AS winner,
					my_score, opp_score, duration_secs AS duration,	total_hits
				FROM UserMatchHistory WHERE user_id = ? ORDER BY match_ts DESC LIMIT ? OFFSET ?;`;
	return new Promise((resolve, reject) => {
		db.all(sql, [user_id, limit, offset], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchHistoryDB | user_id=${user_id}`);
				reject(err);
			} else {
				resolve(rows || []);
			}
		});
	});
}
