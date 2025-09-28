import { sql_log, sql_error } from './dblogger.js';
import { handleMatchEndedDB } from '../Services/matchService.js';

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

export async function getActiveMatchIds(db) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT id FROM Matches WHERE end_time IS NULL`;
		db.all(sql, (err, rows) => {
			if (err) {
				sql_error(err, "getActiveMatchIds");
				reject(err);
			} else {
				resolve(rows.map(r => Number(r.id)));
			}
		});
	});
}

export async function endActiveMatches(db) {
	const activeIds = await getActiveMatchIds(db);
	for (const id of activeIds) {
		try {
			await handleMatchEndedDB(db, id, -1);
		} catch (err) {
			sql_error(err, `endActiveMatches failed for match ${id}: ${err?.message || err}`);
		}
	}
}

export async function performCleanupDB(db) {
	await endActiveMatches(db);
	await bulkLogoutOnlineUsers(db);
}
