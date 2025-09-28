import { getUserByID } from '../Database/users.js';
import { getUserMatchStatsDB } from '../Database/dashboard.js';
import { handleError } from '../errors.js'
import { db } from '../index.js';

async function getUserDataMenu(msg, socket, userId1, userId2)
{
	try {
		if (userId2 == null)
			userId2 = 1;
		let player1 = await getUserByID(db, userId1);
		let player2 = await getUserByID(db, userId2);

		// add google flags for frontend
		player1.google = false;
		player2.google = false;

		// Remove password fields if present
		if (player1 && player1.password) delete player1.password;
		if (player2 && player2.password) delete player2.password;
		// Remove email fields if present
		if (player1 && player1.email) delete player1.email;
		if (player2 && player2.email) delete player2.email;
		// if twofa_secret is 'google' set .google true else false
		if (player1 && player1.twofa_secret && player1.twofa_secret === 'google')
			player1.google = true;
		if (player2 && player2.twofa_secret && player2.twofa_secret === 'google')
			player2.google = true;
		// Remove twofa_secret fields if present
		if (player1 && player1.twofa_secret) delete player1.twofa_secret;
		if (player2 && player2.twofa_secret) delete player2.twofa_secret;

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
		handleError(socket, 'DB_ERROR', 'Database error', err.message || err, 'getUserDataMenu');
		return false;
	}
}

export function handleUserDataMenu(msg, socket, userId1, userId2) {
	if (!msg || !msg.action || msg.action !== 'userDataMenu' || !msg.subaction) {
		handleError(socket, 'MSG_MISSING_ACTION', 'Invalid message format', 'missing (sub)action', 'handleUserDataMenu');
		return false;
	}
	if (msg.subaction === 'getUserDataMenu') {
		return getUserDataMenu(msg, socket, userId1, userId2);
	} else {
		handleError(socket, 'MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', msg.subaction, 'handleUserDataMenu');
		return false;
	}
}