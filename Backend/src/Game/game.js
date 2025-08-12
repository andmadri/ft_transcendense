import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch, quitMatch } from './gameMatch.js';
import { matches } from './gameMatch.js';
import { OT } from '../structs.js'

function handleStartOnlineMatch(msg, match) {
	if (msg.userID == match.player1.id)
		match.player1.ready = true;
	else if (msg.userID == match.player2.id)
		match.player2.ready = true;
	console.log(`Player ${msg.userID} is ready..`);

	if (match.player1.ready && match.player2.ready) {
		console.log("both players are ready to play! START");
		const startMsg = {
			action: 'game',
			subaction: 'start',
		}
		io.to(match.roomID).emit('message', startMsg);
	} else {
		console.log("waiting till the opponent is ready");
		return true;
	}
	return false
}

export function handleGame(msg, socket, userId1, userId2) {
	if (!msg.subaction) {
		console.log('no subaction');
		return ;
	}

	if (msg.subaction == 'init') {
		if (msg.opponentMode != OT.Online)
			return createMatch(msg, socket, userId1, userId2);
	}

	if (!msg.matchID) {
		console.log("No matchID found in msg from frontend");
		console.log(`msg: ${msg.subaction}`);
		return ;
	}

	const match = matches.get(msg.matchID);
	if (!match) {
		return ;
	}

	if (msg.subaction == 'start') {
		if (handleStartOnlineMatch(msg, match))
			return ;
	}

	switch (msg.subaction) {
		case 'ballUpdate':
			updateBall(match, msg, socket);
		case 'scoreUpdate':
			updateScore(match, msg, socket);
			break ;
		case 'padelUpdate':
			updatePadel(match, msg, socket); // Maybe add return / break
		case 'save':
			return saveMatch(match, msg, socket);
		case 'quit':
			return quitMatch(match, msg, socket);
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}