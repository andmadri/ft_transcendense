import { saveMatchDB } from '../Database/match.js'
import { getUserByID } from '../Database/users.js';
import { handleMatchStart } from '../Services/matchService.js';
import { updateMatchInDB } from '../Database/match.js'
import { db } from '../index.js';

let				matchnr = 0;
export const 	matches = new Map();

export const Stage = {
	Start: 0,
	Playing: 1,
	Finish: 2,
	Interrupt: 3
}

// creates a new match, init and returns id nr
export function newMatch(matchnr, id, name, id2, name2) {
	matches.set(matchnr, {
		saveInDB: false,
		dbID: matchnr,
		stage: Stage.Start,
		player1: {
			id: id,
			name: name,
			score: 0,
			paddle: 0,
			pressUp: false,
			pressDown: false,
		},
		player2: {
			id: id2,
			name: name2,
			score: 0,
			paddle: 0,
			pressUp: false,
			pressDown: false
		},
		ball: {
			angle: 0,
			speed: 10,
			x: 0,
			y: 0
		}
	})
}


/*
	-> if player wants to play a game (1vs1, 1vsCOM, Online)
	1vs1 	=> if both logged in => new match
			=> if one or both guest => new match not in db
	1vsCOM	=> if logged in or guest => new match not in db
	Online	=> new match + save match db
*/
export async function createMatch(msg, socket, userId1, userId2) {
	console.log("create new match");
	console.log("playerid1: " + userId1 + " playerid2: " + userId2);
	const	opponentMode = msg.opponentMode;
	if (opponentMode === 2) {
		userId2 = 2;
	}
	// The if statement for the users should be deleted - we should know both users (also for AI and Guest)
	// const	player1ID = userId1 ? userId1 : 2;
	// msg.opponentMode
	// const	player2ID = userId2 ? userId2 : 2;

	const match_id_db = await handleMatchStart(db, {
		player_1_id: userId1,
		player_2_id: userId2,
		match_type: 'vs_ai' // DELETE THIS LINE LATER
	});
	newMatch(match_id_db, userId1, msg.name, userId2, msg.name2);

	console.log(`matchid: ${match_id_db}`);
	socket.send(JSON.stringify({
		action: 'game',
		subaction: 'init',
		id: match_id_db,
		player1ID: userId1,
		player2ID: userId2
	}));
	matches.get(match_id_db).stage = Stage.Playing;
}

export async function quitMatch(match, msg, socket) {
	const name = msg.name ? msg.name : 'unknown player';
	socket.send(JSON.stringify({
		action: 'game',
		subaction: 'quit',
		matchID: match.matchID,
		reason: `match quit by player ${msg.name}`
	}));
	match.stage = Stage.Finish;
}


export function saveMatch(match, msg, socket) {
	// const player1 = match.player1;
	// const player2 = match.player2;
	// console.log(`matchid: ${match.matchID}`);
	updateMatchInDB(db, {
		match_id: msg.matchID, //match.key()
		player_1_score: match.player1.score,
		player_2_score: match.player2.score,
		winner_id: match.player1.score >= match.player2.score ? match.player1.id : match.player2.id, // DELETE THIS LINE LATER
		end_time: new Date().toISOString() // DELETE THIS LINE LATER
	})
	// console.log("Save match" + player1.score + " " + player2.score);
	// if (match.saveInDB)
	// {
	// 	saveMatchDB(player1.id, player2.id, player1.score, player2.score);
	// }
	matches.delete(match.matchID);
	socket.send(JSON.stringify({
		action: 'game',
		subaction: 'save',
		matchID: match.matchID,
		success: true
	}));
}