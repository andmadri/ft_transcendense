import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { createTables } from './schema.js'
import { createNewUserToDB } from './users.js';
import { onUserLogin } from '../Services/sessionsService.js';
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

	if (created) {
		const guest_id = await createNewUserToDB(db, {
			name: 'Guest',
			email: 'guest@guest.guest',
			password: 'secretguest'
		});
		const ai_id = await createNewUserToDB(db, {
			name: 'AI',
			email: 'ai@ai.ai',
			password: 'secretai'
		});

		const test1 = await createNewUserToDB(db, {
			name: 'test1',
			email: 'test1@test1.test1',
			password: 'test1@test1.test1'
		});
		const test2 = await createNewUserToDB(db, {
			name: 'test2',
			email: 'test2@test2.test2',
			password: 'test2@test2.test2'
		});
		const test3 = await createNewUserToDB(db, {
			name: 'test3',
			email: 'test3@test3.test3',
			password: 'test3@test3.test3'
		});
		const test4 = await createNewUserToDB(db, {
			name: 'test4',
			email: 'test4@test4.test4',
			password: 'test4@test4.test4'
		});
		try {
			await onUserLogin(db, guest_id);
			await onUserLogin(db, ai_id);
		} catch(err) {
			console.log("onUserLogin failed: guest / ai id");
		}
	}
	sql_log(`Finished setting up database`);
	return db;
}
