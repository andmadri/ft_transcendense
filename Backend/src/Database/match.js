import { db } from '../index.js'

// returns ID nr of match to save
export async function saveMatchDB(playerID1, playerID2, score1, score2) {
	const date = new Date();
	const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Matches (player_1_id, player_2_id, player_1_score, player_2_score, date) VALUES (?, ?, ?)`,
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