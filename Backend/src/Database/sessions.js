import { db } from '../index.js'
// import { db } from '../database.js'; // ADD THIS LATER
import { getUserByID } from './users.js';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

/**
 * @brief Adds a new session record for a user in the UserSessions table.
 *
 * @param {Object} session - The session data.
 * @param {number} session.user_id - The ID of the user.
 * @param {string} session.state - The session state (Accepts only 'login', 'in_menu', 'in_lobby', 'in_game', 'logout').
 *
 * @returns {Promise<number>} - Resolves with the inserted session ID.
 *
 * @throws {Error} - If insertion fails.
 */
export async function addUserSessionToDB(session) {
	const user = await getUserByID(session.user_id);

	if (!user) {
		throw new Error(`User ID ${session.user_id} does not exist.`);
	}

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO UserSessions (user_id, state) VALUES (?, ?)`;
		db.run(sql, [session.user_id, session.state], function (err) {
			if (err) {
				console.error('Error SQL - addUserSessionToDB:', err.message);
				reject(err);
			} else {
				console.log(`Session created: [${this.lastID}] ${user.name} -> ${session.state}`);
				resolve(this.lastID);
			}
		});
	});
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

