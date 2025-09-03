import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { createTables } from './schema.js'
import { createNewUserToDB } from './users.js';
import { onUserLogin } from '../Services/sessionsService.js';
import { sql_log, sql_error } from './dblogger.js';

const { Database } = sqlite3.verbose();
// const dbpath = './pong.db';
const DB_PATH = process.env.DB_PATH || "/data/pong.db";

// /**
//  * Open sqlite database
//  * 
//  * @param {*} path 
//  * @returns 
//  */
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


function run(db, sql, params = []) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

/**
 * @brief Initializes the SQLite database and creates tables if needed.
 *
 * @returns {Promise<sqlite3.Database>} - Resolves with the connected database instance.
 */
export async function createDatabase() {
	fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
	const db = await openDatabase(DB_PATH);
	
	sql_log(`Connected to the database`);
	await run(db, "PRAGMA foreign_keys = ON");

	await createTables(db);

	const guest_id = await createNewUserToDB(db, {
		name: 'Guest',
		email: 'guest@guest.guest',
		password: 'secretguest'
	});

	try {
		await onUserLogin(db, guest_id);
	} catch(err) {
		console.log("onUserLogin failed: guest id");
	}

	const ai_id = await createNewUserToDB(db, {
		name: 'AI',
		email: 'ai@ai.ai',
		password: 'secretai'
	});

	try {
		await onUserLogin(db, ai_id);
	} catch (err) {
		console.log("onUserLogin failed: ai id");
	}

	sql_log(`Finished setting up database`, false, true);
	return db;
}
