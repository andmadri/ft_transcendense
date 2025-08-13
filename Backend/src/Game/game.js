import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch, quitMatch } from './gameMatch.js';
import { matches } from './gameMatch.js';
import { OT } from '../SharedBuild/OT.js'

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
			sendBallUpdate(match, msg, socket);
			break;
			return updateBall(match, msg, socket);
		case 'scoreUpdate':
			updateScore(match, msg, socket);
			break;
		case 'keyPressUpdate':
			applyKeyPress(match, msg, socket);
			break;
			return updateScore(match, msg, socket);
		case 'padelUpdate':
			sendPaddleUpdate(match, msg, socket); // Maybe add return / break
			return updatePadel(match, msg, socket);
		case 'save':
			return saveMatch(match, msg, socket);
		case 'quit':
			return quitMatch(match, msg, socket);
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}