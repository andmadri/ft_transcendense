import { sql_log, sql_error } from './dblogger.js';

export async function bulkLogoutOnlineUsers(db) {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO UserSessions (user_id, state) SELECT id AS user_id, 'logout' FROM OnlineUsers`;
		db.run(sql, function (err) {
			if (err) {
				sql_error(err, `bulkLogoutOnlineUsers`);
				reject(err);
			} else {
				sql_log(`Cleanup: All OnlineUsers are logged out`);
				resolve();
			}
		});
	});
}

export async function performCleanupDB(db) {
	// await endActiveMatches(db);
	await bulkLogoutOnlineUsers(db);
}
