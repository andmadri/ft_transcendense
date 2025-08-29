import { sql_log, sql_error } from '../Database/dblogger.js';
import { getUserByID } from '../Database/users.js';

function normalizeJSON(json) {
	if (typeof json === 'string') {
		JSON.parse(json);
		return json;
	}
	if (typeof json === 'object' && json !== null) {
		return JSON.stringify(json);
	}
	throw new Error('2FA secret must be a JSON string or object');
}

export async function addUser2faSecretToDB(db, user_id, json) {
	const user = await getUserByID(db, user_id);
	if (!user) {
		throw new Error(`User ID ${user_id} does not exist.`);
	}

	const secretJson = normalizeJSON(json);
	// const secretJson = JSON.parse(json);

	return new Promise((resolve, reject) => {
		const sql = `UPDATE Users SET twofa_secret = ?, last_edited = CURRENT_TIMESTAMP WHERE id = ?`;
		db.run(sql, [secretJson, user_id], function (err) {
			if (err) {
				sql_error(err, `addUser2faSecretToDB | id=${user_id}`);
				reject(err);
			} else {
				sql_log(`2FA secret set for user ${user_id}`);
				resolve();
			}
		});
	});
}

export async function toggleUser2faDB(db, user_id, enabled) {
	const user = await getUserByID(db, user_id);
	if (!user) {
		throw new Error(`User ID ${user_id} does not exist.`);
	}

	if (enabled) {
		if (!user['twofa_secret']) {
			throw new Error(`Cannot enable 2FA: secret is not set for user ${user_id}`);
		}
		return new Promise((resolve, reject) => {
			const sql = `UPDATE Users SET twofa_active = 1, last_edited = CURRENT_TIMESTAMP WHERE id = ?`;
			db.run(sql, [user_id], function (err) {
				if (err) {
					sql_error(err, `toggleUser2faDB(enable) | id=${user_id}`);
					reject(err);
				} else {
					sql_log(`2FA enabled for user ${user_id}`);
					resolve();
				}
			});
		});
	} else {
		return new Promise((resolve, reject) => {
			const sql = `UPDATE Users SET twofa_active = 0, twofa_active = NULL, last_edited = CURRENT_TIMESTAMP WHERE id = ?`;
			db.run(sql, [user_id], function (err) {
				if (err) {
					sql_error(err, `toggleUser2faDB(disable) | id=${user_id}`);
					reject(err);
				} else {
					sql_log(`2FA disabled and secret cleared for user ${user_id}`);
					resolve();
				}
			});
		});
	}
}

export async function getUserSecretDB(db, user_id) {
	const user = await getUserByID(db, user_id);
	if (!user) {
		throw new Error(`User ID ${user_id} does not exist.`);
	}

	return new Promise((resolve, reject) => {
		const sql = `SELECT twofa_secret FROM Users WHERE id = ?`;
		db.get(sql, [user_id], (err, row) => {
			if (err) {
				sql_error(err, `getUserSecretDB | id=${user_id}`);
				reject(err);
			} else {
				resolve(row ? row['twofa_secret'] : null);
			}
		});
	});
}
