import { handleMatchStartDB, handleMatchEndedDB } from '../Services/matchService.js';
import { getUserMatchStatsDB, getAllUserStateDurationsDB } from '../Database/sessions.js';
import { db } from '../index.js';
import { OT } from '../SharedBuild/OT.js'

export const 	matches = new Map();
export const	waitlist = new Map();

export const Stage = {
	Start: 0,
	Pending: 1,
	Init: 2,
	Playing: 3,
	Finish: 4,
	Interrupt: 5
}

// creates a new match, init and returns id nr
async function newMatch(matchnr, id, id2, mode) {
	try {
		const name = await getNamebyUserID(id);
		const name2 = await getNamebyUserID(id2);
		if (!name || !name2) {
			console.error(`Error creating match: Invalid player names for IDs ${id} and ${id2}`);
			return;
		}
		matches.set(matchnr, {
			mode: mode,
			intervalId : null,
			dbID: matchnr,
			stage: Stage.Start,
			roomID: '0',
			player1: {
				id: id,
				name: name,
				score: 0,
				paddleY: 0,
				paddleVY: 0,
				pressUp: false,
				pressDown: false,
				ready: false,
			},
			player2: {
				id: id2,
				name: name2,
				score: 0,
				paddleY: 0,
				paddleVY: 0,
				pressUp: false,
				pressDown: false,
				ready: false,
			},
			ball: {
				vX: 10,
				vY: 10,
				x: 0,
				y: 0,
			}
		});
	} catch (err) {	
		console.error(`Error creating match: ${err}`);
		return;
	
	}
}

// Emit a message to the room indicating the game is starting
function sendInitMatchReadyLocal(socket, userId1, userId2, matchID) {
	socket.send({
		action: 'game',
		subaction: 'init',
		id: matchID,
		player1ID: userId1,
		player2ID: userId2
	});
}

// Emit a message to the room indicating the game is starting
function sendInitMatchReadyRemote(io, matchID) {
	
	io.to(matchID).emit('message', {
		action: 'game',
		subaction: 'init',
		id: matchID,
		// include more info about the game init state
	});
}

/*
 * @brief creates a new match and sends init msg to players
 * @param msg - message containing match details
 * @param socket - socket to send the message back to player
*/
export async function createMatch(msg, socket, userId1, userId2) {
	console.log(`create new match in OT: ${msg.opponentMode} - ${OT.Online}`);
	console.log("playerid1: " + userId1 + " playerid2: " + userId2);

	let opponentMode;
	try {
		opponentMode = Number(msg.opponentMode);
	} catch (err) {
		return console.error("Error parsing opponentMode:", err);
	}

	if (opponentMode === OT.ONEvsCOM)
		userId2 = 2; // COM

	// CREATE MATCH IN DB
	const matchID = await handleMatchStartDB(db, { 
		player_1_id: userId1, 
		player_2_id: userId2
	});

	// CREATE MATCH IN MEMORY
	await newMatch(matchID, userId1, userId2, opponentMode);

	if (opponentMode != OT.Online) {
		sendInitMatchReadyLocal(socket, userId1, userId2, matchID);
	} else {
		// INIT GAME FIRST IN BACKEND
		sendInitMatchReadyRemote(socket.io, matchID);
	}
	matches.get(matchID).stage = Stage.Playing;
}
