import { handleMatchStartDB } from '../Services/matchService.js';
import { getUserByID } from "../Database/users.js";
import { OT, state, MF } from '../SharedBuild/enums.js'

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
		console.log(`Creating match with ID: ${matchnr}, mode: ${mode}, player1: ${name} (${id}), player2: ${name2} (${id2})`);
		matches.set(matchnr, {
			state: state.Start,
			matchID: matchnr,
			matchFormat: MF.Empty, // for now, wasn't used in backend i guess
			mode: mode,
			player1: {
				ID: id,
				name: name,
				ready: false,
				input: { pressUP: false, pressDOWN: false },
				score: 0,
				Twofa: false
			},
			player2: {
				ID: id2,
				name: name2,
				ready: false,
				input: { pressUP: false, pressDOWN: false },
				score: 0,
				Twofa: false
			},
			gameState: {
				time: 0,
				field: { size: {width: 1, height: 0.75}},
				ball: { 
					size: { width: 0.05, height: 0.05 },
					pos: { x: 0.5, y: 0.75 / 2 },
					velocity: { vx: 0, vy: 0 },
					movement: { speed: 0.01 },
					},
				paddle1: { 
					size: { width: 0.02, height: 0.14},
					pos: { x: 0.02, y: (0.75 / 2) },
					velocity: { vx: 0, vy: 0 },
					movement: { speed: 0.015 },
					},
				paddle2: { 
					size: { width: 0.02, height: 0.14 },
					pos: { x: 0.98, y: (0.75 / 2) },
					velocity: { vx: 0, vy: 0 },
					movement: { speed: 0.015 },
					},
			}
		});
	} catch (err) {	
		console.error(`Error creating match: ${err}`);
		return;
	}
}

// Emit a message to the room indicating the game is starting
function sendInitMatchReadyLocal(socket, userId1, userId2, matchID) {
	socket.emit('message', {
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
export async function createMatch(db, mode, socket, userId1, userId2) {
	console.log(`create new match in OT: ${mode} - ${OT.Online}`);
	console.log("playerid1: " + userId1 + " playerid2: " + userId2);
	if (userId1 == userId2) {
		console.log(`UserIds are the same`);
		return (-1);
	}

	if (mode === OT.ONEvsCOM)
		userId2 = 2; // COM

	if (userId2 == null) // This should not happen
		userId2 = 1; // guest

	try {
		// CREATE MATCH IN DB
		const matchID = await handleMatchStartDB(db, { 
			player_1_id: userId1, 
			player_2_id: userId2
		});

		// CREATE MATCH IN MEMORY
		await newMatch(db, matchID, userId1, userId2, mode);

		if (mode != OT.Online) {
			sendInitMatchReadyLocal(socket, userId1, userId2, matchID);
			matches.get(matchID).stage = state.Playing;
		}
		return (matchID);
	} catch (err) {
		console.error(`Error creating match: ${err}`);
		return (-1);
	}
}
