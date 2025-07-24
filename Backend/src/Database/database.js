import sqlite3 from "sqlite3";
import fs from "fs";
import { createTables } from './schema.js'

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
			return console.error('Error openinig database:', err.message);
		}

		console.log('Connected to the database.');
		newdDB.run("PRAGMA foreign_keys = ON");
		if (!existDb) {
			// console.log('Created database tables.');
			createTables(newdDB);
		} else {
			console.log('Database already exists. Skipping table creation.');
		}
	});
	
	return newdDB;
}
