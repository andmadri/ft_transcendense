import { getUserByID } from './users.js';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

/**
 * @brief Inserts a new match into the Matches table. Call this function when the match will start.
 *
 * Supports both player-vs-player and player-vs-AI matches.
 * Requires Player 1 to exist; Player 2 is optional.
 *
 * @param {Object} match - Match details.
 * @param {number} match.player_1_id - ID of player 1 (required).
 * @param {number|null} match.player_2_id - ID of player 2 (optional).
 * @param {string} match.match_type - Match type (Accepts only '1v1', 'vs_guest', 'vs_ai', 'tournament')
 *
 * @returns {Promise<number>} - Resolves with the match ID on success.
 *
 * @throws {Error} - If required players do not exist or SQL insert fails.
 */
export async function addMatchToDB(db, match) {
	const player1 = await getUserByID(db, match.player_1_id);
	if (!player1) {
		throw new Error(`Player 1 (ID ${match.player_1_id}) does not exist.`);
	}

	const player2 = await getUserByID(db, match.player_2_id);
	if (!player2) {
		throw new Error(`Player 2 (ID ${match.player_2_id}) does not exist.`);
	}

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO Matches (player_1_id, player_2_id, match_type) VALUES (?, ?, ?)`;
		db.run(sql, [match.player_1_id, match.player_2_id, match.match_type], function (err) {
			if (err) {
				console.error('Error SQL - addMatchToDB:', err.message);
				reject(err);
			} else {
				console.log(`Match started: [${this.lastID}] ${player1.name} vs ${player2.name}`);
				resolve(this.lastID);
			}
		});
	});
}

/**
 * @brief Inserts a new event into the MatchEvents table.
 * @param {object} db             SQLite database handle.
 * @param {object} event          Match event details.
 * @param {number} event.match_id ID of the match.
 * @param {number} event.user_id  ID of the user causing the event.
 * @param {string} event.event_type  Type of event (e.g., 'goal', 'bounce').
 * @param {number|null} [event.ball_x]            X-position of the ball.
 * @param {number|null} [event.ball_y]            Y-position of the ball.
 * @param {number|null} [event.ball_angle]        Angle of ball movement.
 * @param {number|null} [event.ball_result_x]     X-position after result.
 * @param {number|null} [event.ball_result_y]     Y-position after result.
 * @param {number|null} [event.paddle_x_player_1] Paddle X for player 1.
 * @param {number|null} [event.paddle_y_player_1] Paddle Y for player 1.
 * @param {number|null} [event.paddle_x_player_2] Paddle X for player 2.
 * @param {number|null} [event.paddle_y_player_2] Paddle Y for player 2.
 * @returns {Promise<number>}      Resolves with the new MatchEvent ID.
 * @throws {Error}                 If the match or user does not exist, or SQL fails.
 */
export async function addMatchEventToDB(db, event) {
	const match = await getMatchByID(db, event.match_id);
	if (!match) {
		throw new Error(`Match ID ${event.match_id} does not exist.`);
	}
	const user = await getUserByID(db, event.user_id);
	if (!user) {
		throw new Error(`User ID ${event.user_id} does not exist.`);
	}

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO MatchEvents (
			match_id, user_id, event_type, ball_x, ball_y, ball_angle,
			ball_result_x, ball_result_y, 
			paddle_x_player_1, paddle_y_player_1,
			paddle_x_player_2, paddle_y_player_2)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [event.match_id, event.user_id, event.event_type,
			event.ball_x ?? null, event.ball_y ?? null, 
			event.ball_angle ?? null, event.ball_result_x ?? null, event.ball_result_y ?? null,
			event.paddle_x_player_1 ?? null, event.paddle_y_player_1 ?? null, 
			event.paddle_x_player_2 ?? null, event.paddle_y_player_2 ?? null];
		db.run(sql, values, function (err) {
			if (err) {
				console.error('Error SQL - addMatchEventToDB:', err.message);
				reject(err);
			} else {
				console.log(`Match [${event.match_id}] event: [${this.lastID}] ${user.name} - ${event.event_type}`);
				resolve(this.lastID);
			}
		});
	});
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Updates match outcome and scores in the Matches table.
 *
 * Allows updating final scores, winner, and end time.
 * Only the fields provided will be updated.
 *
 * @param {Object} match - Match update details.
 * @param {number} match.match_id - The ID of the match to update.
 * @param {number} [match.player_1_score] - (Final) score of player 1.
 * @param {number} [match.player_2_score] - (Final) score of player 2.
 * @param {number|null} [match.winner_id] - Winner's user ID - only set when the match is ended.
 * @param {string|null} [match.end_time] - Match end timestamp (ISO 8601 or null) - only set when the match is ended.
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} - If update fails.
 */
export async function updateMatchInDB(db, match) {
	const existingMatch = await getMatchByID(db, match.match_id);
	if (!existingMatch) {
		throw new Error(`Match ID ${match.match_id} does not exist.`);
	}
	
	return new Promise ((resolve, reject) => {
		const updates = [];
		const values = [];

		if (match.player_1_score !== undefined) {
			updates.push("player_1_score = ?");
			values.push(match.player_1_score);
		}
		if (match.player_2_score !== undefined) {
			updates.push("player_2_score = ?");
			values.push(match.player_2_score);
		}
		if (match.winner_id !== undefined) {
			updates.push("winner_id = ?");
			values.push(match.winner_id);
		}
		if (match.end_time !== undefined) {
			updates.push("end_time = ?");
			values.push(match.end_time);
		}

		if (updates.length === 0) {
			console.log("No valid match fields provided to update.");
			return resolve();
		}

		const sql = `UPDATE Matches SET ${updates.join(", ")} WHERE id = ?`;
		values.push(match.match_id);

		db.run(sql, values, function (err) {
			if (err) {
				console.error('Error SQL - updateMatchInDB:', err.message);
				reject(err);
			} else {
				loggerUpdateMatchInDB(db, match.match_id); // ADD LATER: await loggerUpdateMatchInDB(db, match.match_id);
				// console.log(`Match updated: [${match.match_id}] ${this.changes}`); // CHANGE THIS LATER: Logger is invalid - should we log inside the wrappers functions?
				resolve(this.changes);
			}
		});
	});
}

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

/**
 * @brief Fetches a match row by its ID.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with match object or null.
 */
export async function getMatchByID(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Matches WHERE id = ?`;
		db.get(sql, [match_id], (err, row) => {
			if (err) {
				console.error('Error SQL - getMatchByID:', err.message);
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvent row by its ID.
 *
 * @param {number} event_id - The ID of the event to retrieve.
 * @returns {Promise<Object|null>} - Resolves with match object or null.
 */
export async function getMatchEventByID(db, event_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM MatchEvents WHERE id = ?`;
		db.get(sql, [event_id], (err, row) => {
			if (err) {
				console.error('Error SQL - getMatchEventByID:', err.message);
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
}


// *************************************************************************** //
//                           SHOW DATA IN THE LOGGER                           //
// *************************************************************************** //

function sql_log(msg) {
	// if (process.env.LOGSQL) {
	const ts = new Date().toISOString();
	console.log(`[${ts}] ${msg}`);
	// }
}

export async function loggerUpdateMatchInDB(db, match_id) {
	const match = await getMatchByID(db, match_id);
	if (!match) {
		throw new Error(`Match ID ${match_id} does not exist.`);
	}

	const player_1 = await getUserByID(db, match.player_1_id);
	const player_2 = await getUserByID(db, match.player_2_id);
	if (!player_1 || !player_2) {
		throw new Error(`UserID ${match.player_1_id} and/or ${match.player_2_id} does not exist.`);
	}

	if (!match.end_time) {
		sql_log(`Match updated: [${match_id}] ${player_1.name} ${match.player_1_score} - ${match.player_2_score} ${player_2.name}`)
	} else {
		sql_log(`Match ended: [${match_id}] ${player_1.name} ${match.player_1_score} - ${match.player_2_score} ${player_2.name}`)
	}
}
