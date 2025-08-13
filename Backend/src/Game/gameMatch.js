import { handleMatchStartDB, handleMatchEndedDB } from '../Services/matchService.js';
import { getUserMatchStatsDB, getAllUserStateDurationsDB } from '../Database/sessions.js';
import { db } from '../index.js';

export const 	matches = new Map();
export const	waitlist = new Map();

export const Stage = {
	Start: 0,
	Pending: 1,
	Playing: 2,
	Finish: 3,
	Interrupt: 4
}

// creates a new match, init and returns id nr
export function newMatch(matchnr, id, name, id2, name2, mode) {
	matches.set(matchnr, {
		saveInDB: false,
		mode: mode,
		dbID: matchnr,
		stage: Stage.Start,
		roomID: '0',
		player1: {
			id: id,
			name: name,
			score: 0,
			paddle: 0,
			pressUp: false,
			pressDown: false,
			ready: false,
		},
		player2: {
			id: id2,
			name: name2,
			score: 0,
			paddle: 0,
			pressUp: false,
			pressDown: false,
			ready: false,
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

	const matchID = await handleMatchStartDB(db, { 
		player_1_id: userId1, 
		player_2_id: userId2
	});
	newMatch(matchID, userId1, msg.name, userId2, msg.name2);

	// console.log(`matchid: ${matchID}`);
	socket.send(JSON.stringify({
		action: 'game',
		subaction: 'init',
		id: matchID,
		player1ID: userId1,
		player2ID: userId2
	}));
	matches.get(matchID).stage = Stage.Playing;
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


export async function saveMatch(match, msg, socket) {
	// Update the match in the database
	const matchID = await handleMatchEndedDB(db, msg.matchID);
	
	// Show some stats in the terminal
	console.table(matchID);
	console.log(await getUserMatchStatsDB(db, matchID.player_1_id));
	console.log(await getUserMatchStatsDB(db, matchID.player_2_id));
	console.table(await getAllUserStateDurationsDB(db));

	// Delete the data in the backend
	matches.delete(match.matchID);

	// Send a message to the frontend
	socket.send(JSON.stringify({
		action: 'game',
		subaction: 'save',
		matchID: match.matchID,
		success: true
	}));
}
