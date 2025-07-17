import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch } from './gameMatch.js';

export function handleGame(msg, socket) {
	if (!msg.subaction) {
		console.log('no subaction');
		return ;
	}

	switch (msg.subaction) {
		case 'init':
			return createMatch(msg, socket);
		case 'ballUpdate':
			return updateBall(msg, socket);
		case 'padelUpdate':
			return updatePadel(msg, socket );
		case 'scoreUpdate':
			return updateScore(msg, socket);
		case 'save':
			return saveMatch(msg, socket);
		default:
			console.log("subaction not found: " + msg.subaction);
	}

}