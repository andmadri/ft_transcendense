import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch, quitMatch } from '../init/match.js';
import { matches } from '../init/match.js';
import { OT } from '../SharedBuild/OT.js'

export function handleGame(msg, socket) {
	if (!msg.subaction)
		return console.log('no subaction in handleGame');

	// we need to have a matchID by now
	if (!msg.matchID)
		return console.log("No matchID found in msg from frontend");


	const match = matches.get(msg.matchID);
	if (!match)
		return ;

	// Updates that are comming into the backend (Maybe update all in once)
	switch (msg.subaction) {
		case 'ballUpdate':
			sendBallUpdate(match, msg, socket);
			break;
		case 'scoreUpdate':
			updateScore(match, msg, socket);
			break;
		case 'keyPressUpdate':
			applyKeyPress(match, msg, socket);
			break;;
		case 'padelUpdate':
			sendPaddleUpdate(match, msg, socket); // Maybe add return / break
			break ;
		case 'save':
			saveMatch(match, msg, socket);
			break ;
		case 'quit':
			quitMatch(match, msg, socket);
			break ;
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}