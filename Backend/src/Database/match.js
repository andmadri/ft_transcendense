import { getUserByID } from './users.js';
import { sql_log, sql_error } from './dblogger.js';

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
	const matchID = await new Promise((resolve, reject) => {
		const sql = `INSERT INTO Matches (player_1_id, player_2_id, match_type) VALUES (?, ?, ?)`;
		db.run(sql, [match.player_1_id, match.player_2_id, match.match_type], function (err) {
			if (err) {
				sql_error(err, `addMatchToDB | player_1_id=${match.player_1_id} player_2_id=${match.player_2_id}`);
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
	await loggerUpdateMatchInDB(db, matchID);

	return matchID;
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

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO MatchEvents (
			match_id, user_id, event_type, ball_x, ball_y,
			paddle_x_player_1, paddle_y_player_1,
			paddle_x_player_2, paddle_y_player_2)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [event.match_id, event.user_id, event.event_type,
			event.ball_x ?? null, event.ball_y ?? null,
			event.paddle_x_player_1 ?? null, event.paddle_y_player_1 ?? null,
			event.paddle_x_player_2 ?? null, event.paddle_y_player_2 ?? null];
		db.run(sql, values, function (err) {
			if (err) {
				sql_error(err, `addMatchEventToDB id=${event.match_id}`);
				reject(err);
			} else {
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
 * @param {bool} [match.end_time] - If true set the match end timestamp - only set when the match is ended.
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

	const changes = await new Promise ((resolve, reject) => {
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
		if (match.end_time === true) {
			updates.push("end_time = CURRENT_TIMESTAMP");
		}

		if (updates.length === 0) {
			console.log("No valid match fields provided to update.");
			return resolve();
		}

		const sql = `UPDATE Matches SET ${updates.join(", ")} WHERE id = ?`;
		values.push(match.match_id);

		db.run(sql, values, function (err) {
			if (err) {
				sql_error(err, `updateMatchInDB id=${match.match_id}`);
				reject(err);
			} else {
				resolve(this.changes);
			}
		});
	});
	await loggerUpdateMatchInDB(db, match.match_id);

	return changes;
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
				sql_error(err, `getMatchByID id=${match_id}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getMatchByID | match_id not found! match_id=${match_id}`);
				}
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
				sql_error(err, `getMatchEventByID id=${event_id}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getMatchEventByID | event_id not found! event_id=${event_id}`);
				}
				resolve(row || null);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvents rows by its MatchID.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object or null.
 */
export async function getMatchEventsByMatchID(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM MatchEvents WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchEventByID id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchEventsByMatchID | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

export async function getMatchByUserID(db, user_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT id FROM Matches WHERE end_time IS NULL AND (player_1_id = ? OR player_2_id = ?)`;
		db.get(sql, [user_id, user_id], (err, row) => {
			if (err) {
				sql_error(err, `getMatchByUserID id=${user_id}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getMatchByUserID | user_id not found! user_id=${user_id}`);
				}
				resolve(row || null);
			}
		});
	});
}

// *************************************************************************** //
//                           SHOW DATA IN THE LOGGER                           //
// *************************************************************************** //

export async function loggerUpdateMatchInDB(db, match_id) {
	let match = null;
	let player_1 = null;
	let player_2 = null;
	try {
		match = await getMatchByID(db, match_id);
		if (!match) {
			throw new Error(`Match ID ${match_id} does not exist.`);
		}

		player_1 = await getUserByID(db, match.player_1_id);
		player_2 = await getUserByID(db, match.player_2_id);
		if (!player_1 || !player_2) {
			throw new Error(`UserID ${match.player_1_id} and/or ${match.player_2_id} does not exist.`);
		}
	} catch (err) {
		return err;
	}

	if (match.player_1_score === 0 && match.player_2_score === 0 && !match.end_time) {
		sql_log(`Match started: [${match_id}] ${player_1.name} vs ${player_2.name}`)
	} else if (!match.end_time) {
		sql_log(`Match updated: [${match_id}] ${player_1.name} ${match.player_1_score} - ${match.player_2_score} ${player_2.name}`)
	} else {
		sql_log(`Match ended: [${match_id}] ${player_1.name} ${match.player_1_score} - ${match.player_2_score} ${player_2.name}`)
	}
}
