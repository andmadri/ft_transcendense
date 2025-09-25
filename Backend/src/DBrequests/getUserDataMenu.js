import { getUserByID } from '../Database/users.js';
import { getUserMatchStatsDB } from '../Database/dashboard.js';
import { db } from '../index.js';

async function getUserDataMenu(msg, socket, userId1, userId2)
{
	try {
		if (userId2 == null)
			userId2 = 1;
		const player1 = await getUserByID(db, userId1);
		const player2 = await getUserByID(db, userId2);
		const stats1 = await getUserMatchStatsDB(db, userId1);
		const stats2 = await getUserMatchStatsDB(db, userId2);
		const returnMsg = {
			action: 'userDataMenu',
			subaction: 'receivedUserDataMenu',
			user_info1: player1,
			user_info2: player2,
			stats1: stats1,
			stats2: stats2,
		}
		socket.emit('message', returnMsg);
		return true;
	} catch (err) {
		const returnMsg = { action: "error", reason: "Database error" };
		console.log('Database error: ', err);
		socket.emit('error', returnMsg);
		return false;
	}
}

export function handleUserDataMenu(msg, socket, userId1, userId2) {
	if (!msg || !msg.action || msg.action !== 'userDataMenu' || !msg.subaction) {
		const returnMsg = { action: "Error", message: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('message', returnMsg);
		return false;
	}
	if (msg.subaction === 'getUserDataMenu') {
		return getUserDataMenu(msg, socket, userId1, userId2);
	} else {
		const returnMsg = { action: "Error", message: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('message', returnMsg);
		return false;
	}
}