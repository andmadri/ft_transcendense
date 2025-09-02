import { getUserByID } from '../Database/users.js';
import { getUserMatchStatsDB } from '../Database/sessions.js';
import { db } from '../index.js';

async function getUserDataMenu(msg, socket, userId1, userId2)
{
	let playerID = null;
	if (msg.playerNr == 1)
		playerID = userId1;
	else
		playerID = userId2;
	let player = await getUserByID(db, playerID);
	let stats = await getUserMatchStatsDB(db, playerID);
	let returnMsg = {
		action: 'userDataMenu',
		subaction: 'receivedUserDataMenu',
		user_info: player,
		stats: stats,
		playerNr: msg.playerNr
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
		console.log('Received request for player data:', msg, userId1, userId2);
		getUserDataMenu(msg, socket, userId1, userId2);
		return true;
	} else {
		const returnMsg = { action: "Error", message: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('message', returnMsg);
		return false;
	}
}