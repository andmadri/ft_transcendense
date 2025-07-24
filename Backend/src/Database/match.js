import { db } from './database.js';

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
 * @param {string} match.match_type - Match type (Accepts only '1v1', 'vs_ai', 'tournament')
 *
 * @returns {Promise<number>} - Resolves with the match ID on success.
 *
 * @throws {Error} - If required players do not exist or SQL insert fails.
 */
export async function addMatchToDB(match) {
	const player1 = await getUserByID(match.player_1_id);
	
	if (!player1) {
		throw new Error(`Player 1 (ID ${match.player_1_id}) does not exist.`);
	}

	let player2Name = "AI";
	if (match.player_2_id) {
		const player2 = await getUserByID(match.player_2_id);
		if (!player2) {
			throw new Error(`Player 2 (ID ${match.player_2_id}) does not exist.`);
		}
		player2Name = player2.name;
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
export async function updateMatchInDB(match) {
	const existingMatch = await getMatchByID(match.match_id);
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
			console.log("No fields provided to update.");
			return resolve();
		}

		const sql = `UPDATE Matches SET ${updates.join(", ")} WHERE id = ?`;
		values.push(match.match_id);

		db.run(sql, values, function (err) {
			if (err) {
				console.error('Error SQL - updateMatchInDB:', err.message);
				reject(err);
			} else {
				console.log(`Match updated: [${match.match_id}]`);
				resolve();
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
export async function getMatchByID(match_id) {
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


// import { db } from '../database.js'; // ADD THIS LATER

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

export async function addMatchToDB(match) {
	const player1 = await getUserByID(match.player_1_id);
	
	if (!player1) {
		throw new Error(`Player 1 (ID ${match.player_1_id}) does not exist.`);
	}

	let player2Name = "AI";
	if (match.player_2_id) {
		const player2 = await getUserByID(match.player_2_id);
		if (!player2) {
			throw new Error(`Player 2 (ID ${match.player_2_id}) does not exist.`);
		}
		player2Name = player2.name;
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



// returns ID nr of match to save
export async function saveMatchDB(playerID1, playerID2, score1, score2) {
	const date = new Date();
	const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Matches (player_1_id, player_2_id, player_1_score, player_2_score, date) VALUES (?, ?, ?, ?, ?)`,
			[playerID1, playerID2, score1, score2, dateString],
			function (err) {
				if (err)
					reject(err);
				else
					resolve(this.lastID);
			}
		);
	});	
}

// get score in match in map (score1, score2)
export async function getScore(id) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT player_1_score, player_2_score FROM Matches WHERE id = ?`,
			[id],
			(err, row) => {
				if (err)
					reject(err);
				else if (!row)
					resolve(null);
				else {
					resolve({
						score1: row.player_1_score,
						score2: row.player_2_score
					});
				}
			}
		);
	})
}

// get the playerID's in the match
async function getPlayersInMatch(id) {
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT player_1_id, player_2_id FROM Matches WHERE id = ?`,
			[id],
			(err, row) => {
				if (err)
					reject(err);
				else
					resolve({
						player1ID: row.player_1_id,
						player2ID: row.player_2_id
					});
			}
		);
	});
}