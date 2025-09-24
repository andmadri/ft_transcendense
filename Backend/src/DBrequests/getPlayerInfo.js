import * as userDB from '../Database/users.js';
import { checkName, checkPassword, checkEmail } from '../Auth/userValidation.js';
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
	returnMsg.google = player1.twofa_secret === 'google' ? true : false

	if (userId2) {
		player2 = await userDB.getUserByID(db, userId2);
	}
	returnMsg.name2 = player2?.name || 'Guest';
	returnMsg.id2 = player2?.id || 1;
	returnMsg.player2Login = player2?.online || true;
	returnMsg.score2 = player2?.score || 0;
	socket.emit('message', returnMsg);
}

function sendProfileSettingsMsg(socket, msg, success, returnMsg) {
	socket.emit('message', {
		action: 'playerInfo',
		subaction: 'profileSettings',
		userID: msg.user_id,
		field: msg.field,
		success: success,
		msg: returnMsg
	})
}

export async function changeProfileSettings(socket, db, msg) {
	if (!msg.user_id || ! msg.field || !msg.new) {
		socket.emit('serverError', { reason: "Unknown Server error" });
		return ;
	}
	let user = null;
	try {
		user = userDB.getUserByID(db, msg.user_id);
	} catch(err) {
		console.error("User does not exist Profile Settings");
	}
	if (msg.field == 'name') {
		if (user.name == msg.new) {
			return (sendProfileSettingsMsg(socket, msg, 0, 'You are already using this name.'));
		} else {
			const errMsg = await checkName(msg.new);
			if (errMsg)
				return (sendProfileSettingsMsg(socket, msg, 0, errMsg));
		}
		user.name = msg.name;
	} else if (msg.field == 'password') {
		if (user.password == msg.new) {
			return (sendProfileSettingsMsg(socket, msg, 0, 'You are already using this password.'));
		} else {
			const errMsg = checkPassword(msg.new);
			if (errMsg)
				return (sendProfileSettingsMsg(socket, msg, 0, errMsg));
		}
		user.password = msg.new;
	} else if (msg.field == 'email') {
		if (user.email == msg.new) {
			return (sendProfileSettingsMsg(socket, msg, 0, 'You are already using this email.'));
		} else {
			const errMsg = await checkEmail(msg.new);
			if (errMsg)
				return (sendProfileSettingsMsg(socket, msg, 0, errMsg));
		}
		user.email = msg.new;
	}
	
	try {
		await userDB.updateUserInDB(db, msg);
		sendProfileSettingsMsg(socket, msg, 1, msg.new);
		return;
	}
	catch(err) {
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
	} else if (msg.subaction == 'profileSettings') {
		changeProfileSettings(socket, db, msg);
	} else {
		socket.emit('serverError', { reason: "Unknown Server error" });
		console.log('Unknown subaction handlePlayerInfo:', msg.subaction);
		return false;
	}
}