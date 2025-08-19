import { handleMatchStartDB } from '../Services/matchService.js';
import { getUserByID } from "../Database/users.js";
import { OT, state } from '../SharedBuild/enums.js'

export const 	matches = new Map();
export const	waitlist = new Map();

async function getNamebyUserID(db, userID) {
	try {
		const user = await getUserByID(db, userID);
		if (user && user.name)
			return (user.name);
		else {
			if (!user)
				console.error(`User ${userID} not found in db`);
			else
				console.error(`Username not found in user with ID ${userID}`);
			return (null);
		}
	} catch(err) {
		console.error(err);
		return (null);
	}
}

// creates a new match, init and returns id nr
async function newMatch(db, matchnr, id, id2, mode) {
	try {
		const name = await getNamebyUserID(db, id);
		const name2 = await getNamebyUserID(db, id2);
		if (!name || !name2) {
			console.error(`Error creating match: Invalid player names for IDs ${id} and ${id2}`);
			return;
		}
		matches.set(matchnr, {
			mode: mode,
			intervalId : null,
			dbID: matchnr,
			stage: state.Start,
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

/*
 * @brief creates a new match and sends init msg to players
 * @param msg - message containing match details
 * @param socket - socket to send the message back to player
 * @returns match ID (needed for rooms)
*/
export async function createMatch(db, opponentMode, socket, userId1, userId2) {
	console.log(`create new match in OT: ${opponentMode} - ${OT.Online}`);
	console.log("playerid1: " + userId1 + " playerid2: " + userId2);

	if (opponentMode === OT.ONEvsCOM)
		userId2 = 2; // COM

	try {
		// CREATE MATCH IN DB
		const matchID = await handleMatchStartDB(db, { 
			player_1_id: userId1, 
			player_2_id: userId2
		});

		// CREATE MATCH IN MEMORY
		await newMatch(db, matchID, userId1, userId2, opponentMode);

		if (opponentMode != OT.Online) {
			sendInitMatchReadyLocal(socket, userId1, userId2, matchID);
			matches.get(matchID).stage = state.Playing;
		}
		return (matchID);
	} catch (err) {
		console.error(`Error creating match: ${err}`);
		return (-1);
	}
	
}
