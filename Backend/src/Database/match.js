import { db } from '../index.js'

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