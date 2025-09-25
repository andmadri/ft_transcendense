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
				console.error(`PLAYER_NOT_FOUND User ${userID} not found in db`, 'getNamebyUserID');
			else
				console.error(`DB_NOT_FOUND Username not found in user with ID ${userID}`, 'getNamebyUserID');
			return (null);
		}
	} catch(err) {
		console.error('DB_ERROR', err.message || err, 'getNamebyUserID');
		return (null);
	}
}

// creates a new match, init and returns id nr
async function newMatch(db, matchnr, id, id2, mode, tournamentContext, mf) {
	try {
		const name = await getNamebyUserID(db, id);
		const name2 = await getNamebyUserID(db, id2);
		if (!name || !name2) {
			console.error(`PLAYER_INVALID_NAME Error creating match: Invalid player names for IDs ${id} and ${id2}`, 'newMatch');
			return (-1);
		}
		matches.set(matchnr, {
			state: state.Start,
			matchID: matchnr,
			matchFormat: mf,
			intervalID: null,
			pauseTimeOutID: null,
			resumeTime: -1,
			lastUpdateTime: null,
			mode: mode,
			lastScoreID: -1,
			tournamentId: tournamentContext?.tournamentId || null,
			tournamentMatchNumber: tournamentContext?.matchNumber || null,
			winnerID: null,
			player1: {
				ID: id,
				name: name,
				ready: false,
				input: { pressUP: false, pressDOWN: false },
				score: 0,
			},
			player2: {
				ID: id2,
				name: name2,
				ready: false,
				input: { pressUP: false, pressDOWN: false },
				score: 0,
			},
			gameState: {
				time: 0,
				field: { size: {width: 1, height: 0.75}},
				ball: { 
					size: { width: 0.05, height: 0.05 },
					pos: { x: 0.5, y: 0.75 / 2 },
					velocity: { vx: 0, vy: 0 },
					movement: { speed: 0.5 },
					},
				paddle1: { 
					size: { width: 0.02, height: 0.14},
					pos: { x: 0.02, y: (0.75 / 2) },
					velocity: { vx: 0, vy: 0 },
					movement: { speed: 0.6 },
					},
				paddle2: { 
					size: { width: 0.02, height: 0.14 },
					pos: { x: 0.98, y: (0.75 / 2) },
					velocity: { vx: 0, vy: 0 },
					movement: { speed: 0.6 },
					},
			}
		});
		return (1);
	} catch (err) {	
		console.error(`GEN_UNKNOWN newMatch - Error creating match: ${err.message || err}`, 'newMatch');
		return (-1);
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
export async function createMatch(db, mode, socket, userId1, userId2, tournamentContext, mf) {
	if (userId1 == userId2) {
		console.error(`MATCH_SAME_PLAYER UserIds are the same`, 'createMatch');
		return (-1);
	}

	if (mode === OT.ONEvsCOM)
		userId2 = 2;

	if (userId2 == null)
		userId2 = 1;

	if ((userId1 == 1 && userId2 == 2) || (userId2 == 1 && userId1 == 2)) {
		console.error(`MATCH_GUEST_AI_INVALID Match Guest vs AI is not allowed!`, 'createMatch');
		return (-1);
	}

	try {
		// CREATE MATCH IN DB
		let MatchIsTournament = false;
		if (tournamentContext) {
			MatchIsTournament = true;
		}
		const matchID = await handleMatchStartDB(db, { 
			player_1_id: userId1, 
			player_2_id: userId2,
			isTournament: MatchIsTournament
		});
		if (matchID === -1) {
			return (-1);
		}

		// CREATE MATCH IN MEMORY
		const initOk = await newMatch(db, matchID, userId1, userId2, mode, tournamentContext, mf);
		if (initOk === -1) {
			return (-1);
		}

		if (mode != OT.Online) {
			sendInitMatchReadyLocal(socket, userId1, userId2, matchID);
			matches.get(matchID).state = state.Playing;
		}
		return (matchID);
	} catch (err) {
		console.error(`SRV_CREATE_MATCH_EXCEPTION createMatch - Error creating match: ${err.message || err}`, 'createMatch');
		return (-1);
	}
}
