import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { createTables } from './schema.js'
import { createNewUserToDB, getUserByEmail } from './users.js';
import { onUserLogin, setUserSession } from '../Services/sessionsService.js';
import { sql_log, sql_error } from './dblogger.js';

const { Database } = sqlite3.verbose();
const DB_PATH = process.env.DB_PATH || "/data/pong.db";

/**
 * @brief Opens (or creates) a SQLite database at the given path.
 *
 * @param {string} path - Filesystem path to the SQLite database file.
 * @returns {Promise<sqlite3.Database>} - Resolves with a connected database instance.
 */
function openDatabase(path) {
	return new Promise((resolve, reject) => {
		const db = new Database(path, (err) => {
			if (err) {
				sql_error(err, `openDatabase | path=${path}`);
				reject(err);
			} else {
				resolve(db);
			}
		});
	});
}

/**
 * @brief Ensures that the schema exists, creating tables/views if needed.
 *
 * Uses PRAGMA user_version (an integer stored in the SQLite file header) to track
 * schema versioning. If user_version < 1, it runs @ref createTables and sets the
 * version to 1.
 *
 * @param {sqlite3.Database} db - The connected database instance.
 * @returns {Promise<boolean>} - True if schema was created, false if already up-to-date.
 */
async function ensureSchema(db) {
	const row = await new Promise((resolve, reject) => {
		const sql = `PRAGMA user_version;`;
		db.get(sql, (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
	const version = row && typeof row.user_version === 'number' ? row.user_version : 0;
	if (version < 1) {
		await createTables(db);
		await new Promise((resolve, reject) => {
			const sql = `PRAGMA user_version = 1;`;
			db.exec(sql, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
		return true;
	}
	sql_log(`Database already created. Skip creating tables and views`);
	return false;
}

/**
 * @brief Initializes the SQLite database.
 *
 * Steps:
 *  - Ensures the database file and directory exist.
 *  - Connects to SQLite.
 *  - Enables foreign key enforcement (PRAGMA foreign_keys = ON).
 *  - Ensures schema exists via @ref ensureSchema.
 *  - Seeds the database with default "Guest" and "AI" users if schema was freshly created.
 *
 * @returns {Promise<sqlite3.Database>} - Resolves with the connected and ready database instance.
 */
export async function createDatabase() {
	fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
	const db = await openDatabase(DB_PATH);

	sql_log(`Connected to the database`);

	 // Enforce foreign key constraints (disabled by default in SQLite).
	await new Promise((resolve, reject) => {
		const sql = `PRAGMA foreign_keys = ON;`;
		db.exec(sql, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});

	const created = await ensureSchema(db);

	let guest_id = null;
	let ai_id = null;
	if (created) {
		try {
			guest_id = await createNewUserToDB(db, {
				name: 'Guest',
				email: 'guest@guest.guest',
				password: 'secretguest'
			});
			ai_id = await createNewUserToDB(db, {
				name: 'AI',
				email: 'ai@ai.ai',
				password: 'secretai'
			});
		} catch(err) {
			console.error('CREATE_USER_ERROR', `Error creating guest/AI accounts: ${err.message || err}`, 'createDatabase');
			return db;
		}
		if (!guest_id || !ai_id) {
			console.error('CREATE_USER_ERROR', 'guest_id and/or ai_id missing after account creation', 'createDatabase');
		}
		try {
			if (guest_id) {
				await onUserLogin(db, guest_id);
				await setUserSession(db, guest_id, 'in_menu');
			}
			if (ai_id) {
				await onUserLogin(db, ai_id);
				await setUserSession(db, ai_id, 'in_menu');
			}
		} catch(err) {
			console.error('LOGIN_ERROR', 'onUserLogin failed for guest or AI id', err.message || err, 'createDatabase');
			return db;
		}
	} else {
		try {
			guest_id = await getUserByEmail(db, 'guest@guest.guest');
			if (guest_id) {
				guest_id = guest_id.id;
				await onUserLogin(db, guest_id);
				await setUserSession(db, guest_id, 'in_menu');
			}
			ai_id = await getUserByEmail(db, 'ai@ai.ai');
			if (ai_id) {
				ai_id = ai_id.id;
				await onUserLogin(db, ai_id);
				await setUserSession(db, ai_id, 'in_menu');
			}
		} catch(err) {
			console.error('LOGIN_ERROR', 'onUserLogin failed for guest or AI id', err.message || err, 'createDatabase');
			return db;
		}
	}
	sql_log(`Finished setting up database`);
	return db;
}
