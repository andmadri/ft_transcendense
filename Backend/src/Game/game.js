import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch, quitMatch } from './gameMatch.js';
import { matches } from './gameMatch.js';

export function handleGame(msg, socket) {
	if (!msg.subaction)
		return console.log('no subaction in handleGame');

	// we need to have a matchID by now
	if (!msg.matchID)
		return console.log("No matchID found in msg from frontend");


	const match = matches.get(msg.matchID);
	if (!match) {
		return ;
	}

	// Updates that are comming into the backend (Maybe update all in once)
	switch (msg.subaction) {
		case 'ballUpdate':
			return updateBall(match, msg, socket);
		case 'scoreUpdate':
			return updateScore(match, msg, socket);
		case 'padelUpdate':
			return updatePadel(match, msg, socket);
		case 'save':
			return saveMatch(match, msg, socket);
		case 'quit':
			return quitMatch(match, msg, socket);
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}