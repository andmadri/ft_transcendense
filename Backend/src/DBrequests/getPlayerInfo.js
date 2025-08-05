import * as userDB from '../Database/users.js';

function isGuest() {
	const player = {
		name: 'guest',
		id: 0,
		online: true,
		score: 0
	}
	return player;
}

async function getPlayerData(msg, socket, userId1, userId2) {
	let returnMsg = {
		action: "playerInfo",
		subaction: "receivePlayerData"
	};
	let player1 = null;
	let player2 = null;
	if (userId1) {
		if (userId1 != 0)
			player1 = await userDB.getUserByID(userId1);
		else
			player1 = isGuest();
	}
	// console.log('Player 1:', player1);
	returnMsg.name = player1?.name || 'unknown';
	returnMsg.id = player1?.id || 0;
	returnMsg.player1Login = player1?.online || false;
	returnMsg.score = player1?.score || 0;

	if (userId2) {
		if (userId2 != 0)
			player2 = await userDB.getUserByID(userId2);
		else
			player2 = isGuest();
	}
	// console.log('Player 2:', player2);
	returnMsg.name2 = player2?.name || 'unknown';
	returnMsg.id2 = player2?.id || -1;
	returnMsg.player2Login = player2?.online || false;
	returnMsg.score2 = player2?.score || 0;
	// console.log('Sending player data:', returnMsg);
	socket.send(JSON.stringify(returnMsg));
}


export function handlePlayerInfo(msg, socket, userId1, userId2) {
	if (!msg || !msg.action || msg.action !== 'playerInfo' || !msg.subaction) {
		const returnMsg = { action: "Error", message: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.send(JSON.stringify(returnMsg));
		return false;
	}
	if (msg.subaction == 'getPlayerData') {
		console.log('Received request for player data:', msg, userId1, userId2);
		getPlayerData(msg, socket, userId1, userId2);
		return true;
	} else {
		const returnMsg = { action: "Error", message: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.send(JSON.stringify(returnMsg));
		return false;
	}
}