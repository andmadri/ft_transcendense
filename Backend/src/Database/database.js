import sqlite3 from "sqlite3";
import fs from "fs";
import { createTables } from './schema.js'
import { addUserToDB } from './users.js';
import { onUserLogin } from '../Services/sessionsService.js';
import { sql_log, sql_error } from './dblogger.js';

const { Database } = sqlite3.verbose();
const dbpath = './pong.db';

/**
 * @brief Initializes the SQLite database and creates tables if needed.
 *
 * @returns {Promise<sqlite3.Database>} - Resolves with the connected database instance.
 */
export async function createDatabase() {
	const existDb = fs.existsSync(dbpath);
	const newdDB = new Database(dbpath, (err) => {
		if (err) {
			sql_error(err, `Error openinig database`);
			return ;
		}

		sql_log(`Connected to the database`);
		console.log('Connected to the database.');
		newdDB.run("PRAGMA foreign_keys = ON");
		if (!existDb) {
			createTables(newdDB);
		} else {
			sql_log(`Database already exists. Skipping table creation.`);
			return existDb;
		}
	});

	// creating a guest and AI user for testing purposes -> create a function for that later
	const guest_id = await addUserToDB(newdDB, {
		name: 'Guest',
		email: 'guest@guest.guest',
		password: 'secretguest',
		avatar_url: null
	});
	await onUserLogin(newdDB, guest_id);
	
	const ai_id = await addUserToDB(newdDB, {
		name: 'AI',
		email: 'ai@ai.ai',
		password: 'secretai',
		avatar_url: null
	});
	await onUserLogin(newdDB, ai_id);

	return newdDB;
}
