import * as userDB from '../Database/users.js';
import { checkName, checkPassword, checkEmail } from '../Auth/userValidation.js';
import { db } from '../index.js';
import { handleError } from '../errors.js';

async function getPlayerData(msg, socket, userId1, userId2) {
	console.log(`getPlayerData | userId1=${userId1} - userId2=${userId2}`);
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
	if (player1 && player1.twofa_secret)
		returnMsg.google = player1.twofa_secret === 'google' ? true : false
	else 
		returnMsg.google = false;

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
		handleError(socket, 'MSG_MISSING_FIELD', "Missing information", msg, 'changeName');
		return ;
	}
	let user = null;
	let updateMsg = {};
	try {
		user = await userDB.getUserByID(db, msg.user_id);
		updateMsg.user_id = msg.user_id;
	} catch(err) {
		console.error("User does not exist Profile Settings");
		return ;
	}

	if (msg.field == 'name') {
		if (user.name == msg.new) {
			return (sendProfileSettingsMsg(socket, msg, 0, 'You are already using this name.'));
		} else {
			const errMsg = await checkName(msg.new);
			if (errMsg)
				return (sendProfileSettingsMsg(socket, msg, 0, errMsg));
		}
		updateMsg.name = msg.new;
	} else if (msg.field == 'password') {
		const errMsg = checkPassword(msg.new);
		if (errMsg)
			return (sendProfileSettingsMsg(socket, msg, 0, errMsg));
		updateMsg.password = msg.new;
	} else if (msg.field == 'email') {
		if (user.email == msg.new) {
			return (sendProfileSettingsMsg(socket, msg, 0, 'You are already using this email.'));
		} else {
			const errMsg = await checkEmail(msg.new);
			if (errMsg)
				return (sendProfileSettingsMsg(socket, msg, 0, errMsg));
		}
		updateMsg.email = msg.new;
	}
	console.log(updateMsg);
	try {
		await userDB.updateUserInDB(db, updateMsg);
		sendProfileSettingsMsg(socket, msg, 1, msg.new);
		return;
	}
	catch(err) {
		handleError(socket, 'DB_UNKNOWN', 'Unknown error occurred', `while adding user`, err.message || err, 'changeName');
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
	} else if (msg.subaction == 'profileSettings') {
		changeProfileSettings(socket, db, msg);
	} else {
		handleError(socket, 'MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown subaction:', msg.subaction, 'handlePlayerInfo');
		return false;
	}
}