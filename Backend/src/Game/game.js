import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch, quitMatch } from './gameMatch.js';
import { matches } from './gameMatch.js';

export function handleGame(msg, socket, userId1, userId2) {
	if (!msg.subaction) {
		console.log('no subaction');
		return ;
	}

	if (msg.subaction == 'init')
		return createMatch(msg, socket, userId1, userId2);

	if (!msg.matchID) {
		console.log("No matchID found in msg from frontend");
		return ;
	}

	const match = matches.get(msg.matchID);
	if (!match) {
		return ;
	}

	switch (msg.subaction) {
		case 'ballUpdate':
			return updateBall(match, msg, socket);
		case 'padelUpdate':
			return updatePadel(match, msg, socket );
		case 'scoreUpdate':
			return updateScore(match, msg, socket);
		case 'save':
			// console.log(`save: matchid=${msg.matchID} - ${match.matchID}`);
			return saveMatch(match, msg, socket);
		case 'quit':
			return quitMatch(match, msg, socket);
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}