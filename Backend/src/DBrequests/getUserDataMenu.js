import { getUserByID } from '../Database/users.js';
import { getUserMatchStatsDB } from '../Database/sessions.js';
import { db } from '../index.js';

async function getUserDataMenu(msg, socket, userId1, userId2)
{
	// let playerID = null;
	// if (msg.playerNr == 1)
	// playerID1 = userId1;
	// else
		// playerID = userId2;
	if (userId2 == null)
		userId2 = 1;
	let player1 = await getUserByID(db, userId1);
	let player2 = await getUserByID(db, userId2);
	let stats1 = await getUserMatchStatsDB(db, userId1);
	let stats2 = await getUserMatchStatsDB(db, userId2);
	let returnMsg = {
		action: 'userDataMenu',
		subaction: 'receivedUserDataMenu',
		user_info1: player1,
		user_info2: player2,
		stats1: stats1,
		stats2: stats2,
		// playerNr: msg.playerNr
	}
	socket.emit('message', returnMsg);
}

export function handleUserDataMenu(msg, socket, userId1, userId2) {
	if (!msg || !msg.action || msg.action !== 'userDataMenu' || !msg.subaction) {
		const returnMsg = { action: "Error", message: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('message', returnMsg);
		return false;
	}
	if (msg.subaction == 'getUserDataMenu') {
		console.log('Received request for player data:', userId1, userId2);
		getUserDataMenu(msg, socket, userId1, userId2);
		return true;
	} else {
		const returnMsg = { action: "Error", message: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('message', returnMsg);
		return false;
	}
}