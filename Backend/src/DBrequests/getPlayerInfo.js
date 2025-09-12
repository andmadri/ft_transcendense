import * as userDB from '../Database/users.js';
import { checkName } from '../Auth/userValidation.js';
import { db } from '../index.js';

async function getPlayerData(msg, socket, userId1, userId2) {
	let returnMsg = {
		action: "playerInfo",
		subaction: "receivePlayerData"
	};
	let player1 = null;
	let player2 = null;
	if (userId1) {
		player1 = await userDB.getUserByID(db, userId1);
	}
	returnMsg.name = player1?.name || 'unknown';
	returnMsg.id = player1?.id || 0;
	returnMsg.player1Login = player1?.online || false;
	returnMsg.score = player1?.score || 0;

	if (userId2) {
		player2 = await userDB.getUserByID(db, userId2);
	}
	// console.log('Player 2:', player2);
	returnMsg.name2 = player2?.name || 'Guest';
	returnMsg.id2 = player2?.id || 1;
	returnMsg.player2Login = player2?.online || true;
	returnMsg.score2 = player2?.score || 0;
	// console.log('Sending player data:', returnMsg);
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
		console.error("Not all info changeName");
		socket.emit('serverError', { reason: "Unknown Server error" });
		return ;
	}

	if (msg.oldName == msg.name) {
		return (sendChangingNameMsg(socket, msg, 0, 'You are already using this name.'));
	} else {
		const errMsg = checkName(msg.oldName);
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
			socket.emit('serverError', { reason: "Unknown error occurred while adding user." });
	}
}


export function handlePlayerInfo(msg, socket, userId1, userId2) {
	if (!msg || !msg.action || msg.action !== 'playerInfo' || !msg.subaction) {
		const returnMsg = { action: "Error", message: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('message', returnMsg);
		return false;
	}
	if (msg.subaction == 'getPlayerData') {
		console.log('Received request for player data:', msg, userId1, userId2);
		getPlayerData(msg, socket, userId1, userId2);
		return true;
	} else if (msg.subaction == 'changeName') {
		changeName(socket, db, msg);
	} else {
		socket.emit('serverError', { reason: "Unknown Server error" });
		console.log('Unknown subaction handlePlayerInfo:', msg.subaction);
		return false;
	}
}