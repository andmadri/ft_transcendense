import * as userDB from '../Database/users.js';
import { checkName } from '../Auth/userValidation.js';
import { db } from '../index.js';
import { handleError } from '../errors.js'

async function getPlayerData(msg, socket, userId1, userId2) {
	let returnMsg = {
		action: "playerInfo",
		subaction: "receivePlayerData"
	};
	let player1 = null;
	let player2 = null;
	try {
		if (userId1) {
			player1 = await userDB.getUserByID(db, userId1);
		}
	} catch (err) {
		console.error('GET_USER_BY_ID_ERROR', err.message || err, 'getPlayerData - userId1', 'getPlayerData');
	}
	returnMsg.name = player1?.name || 'unknown';
	returnMsg.id = player1?.id || 0;
	returnMsg.player1Login = player1?.online || false;
	returnMsg.score = player1?.score || 0;

	try {
		if (userId2) {
			player2 = await userDB.getUserByID(db, userId2);
		}
	} catch (err) {
		console.error('GET_USER_BY_ID_ERROR', err.message || err, 'getPlayerData - userId2', 'getPlayerData');
	}
	returnMsg.name2 = player2?.name || 'Guest';
	returnMsg.id2 = player2?.id || 1;
	returnMsg.player2Login = player2?.online || true;
	returnMsg.score2 = player2?.score || 0;
	socket.emit('message', returnMsg);
}

function sendChangingNameMsg(socket, msg, success, returnMsg) {
	socket.emit('message', {
		action: 'playerInfo',
		subaction: 'changeName',
		userID: msg.user_id,
		success: success,
		msg: returnMsg
	})
}

export async function changeName(socket, db, msg) {
	if (!msg.user_id || !msg.oldName || !msg.name) {
		handleError(socket, 'MSG_MISSING_FIELD', "Missing information", msg, 'changeName');
		return ;
	}

	if (msg.oldName == msg.name) {
		return (sendChangingNameMsg(socket, msg, 0, 'You are already using this name.'));
	} else {
		const errMsg = await checkName(msg.name);
		if (errMsg)
			return (sendChangingNameMsg(socket, msg, 0, errMsg));
	}

	try {
		await userDB.updateUserInDB(db, msg);
		sendChangingNameMsg(socket, msg, 1, msg.name);
		return;
	}
	catch(err) {
		if (err.code === 'SQLITE_CONSTRAINT') {
			if (err.message.includes('Users.name'))
				return (sendChangingNameMsg(socket, msg, 0, 'That username is already taken.'));
		} else
			handleError(socket, 'DB_UNKNOWN', 'Unknown error occurred', `while adding user`, err.message || err, 'changeName')
	}
}


export function handlePlayerInfo(msg, socket, userId1, userId2) {
	if (!msg || !msg.action || msg.action !== 'playerInfo' || !msg.subaction) {
		handleError(socket, 'MSG_MISSING_ACTION', 'Invalid message format', 'Missing (sub)action', 'handlePlayerInfo');
		return false;
	}

	if (msg.subaction == 'getPlayerData') {
		console.log('Received request for player data:', msg, userId1, userId2);
		getPlayerData(msg, socket, userId1, userId2);
		return true;
	} else if (msg.subaction == 'changeName') {
		changeName(socket, db, msg);
	} else {
		handleError(socket, 'MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown subaction:', msg.subaction, 'handlePlayerInfo');
		return false;
	}
}