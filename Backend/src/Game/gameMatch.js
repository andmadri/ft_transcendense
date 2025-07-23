import { saveMatchDB } from '../Database/match.js'
import { getUserByID } from '../Database/users.js';

let				matchnr = 0;
export const 	matches = new Map();

export const Stage = {
	Start: 0,
	Playing: 1,
	Finish: 2,
	Interrupt: 3
}

// creates a new match, init and returns id nr
export function newMatch(id, name, id2, name2) {
	matchnr++;
	matches.set(matchnr, {
		saveInDB: false,
		dbID: -1,
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
	return (matchnr);
}


/*
	-> if player wants to play a game (1vs1, 1vsCOM, Online)
	1vs1 	=> if both logged in => new match
			=> if one or both guest => new match not in db
	1vsCOM	=> if logged in or guest => new match not in db
	Online	=> new match + save match db
*/
export function createMatch(msg, socket) {
	console.log("create new match");
	const	opponentMode = msg.opponentMode;
	const	player1ID = msg.player1ID ? msg.player1ID : 0;
	const	player2ID = msg.player2ID ? msg.player2ID : 0;
	
	const id = newMatch(msg.player1ID, msg.name, msg.player2ID, msg.name2);
	if (opponentMode == 1 && player1ID != 0 && player2ID != 0) // both not guest or comp
		matches.get(id).saveInDB = true;
	else if (opponentMode == 2) // online
		matches.get(id).saveInDB = true;
	
	socket.send(JSON.stringify({ 
		action: 'game',
		subaction: 'init',
		id,
		player1ID,
		player2ID
	}));
	matches.get(id).stage = Stage.Playing;
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
	const player1 = match.player1;
	const player2 = match.player2;
	if (match.saveInDB && match.stage == Stage.Finish) {
		saveMatchDB(player1.id, player2.id, player1.score, player2.score);
		matches.delete(match.matchID);
		socket.send(JSON.stringify({
			action: 'game',
			subaction: 'save',
			matchID: match.matchID,
			success: true
		}));
	}
}