import { sendBallUpdate, sendPaddleUpdate, updateScore } from "./gameStateSync.js";
import { saveMatch, quitMatch } from '../InitGame/match.js';
import { matches } from '../InitGame/match.js';
import { OT } from '../SharedBuild/OT.js'

export function handleGame(msg, socket, io) {
	if (!msg.subaction)
		return console.log('no subaction in handleGame');

	// we need to have a matchID by now
	if (!msg.matchID)
		return console.log("No matchID found in msg from frontend");

	const match = matches.get(msg.matchID);
	if (!match)
		return console.error(`No match found with ${msg.matchID}`);

	// Updates that are comming into the backend (Maybe better to update all in once)
	switch (msg.subaction) {
		case 'ballUpdate':
			sendBallUpdate(match, msg, socket, io);
			break;
		case 'scoreUpdate':
			updateScore(match, msg, io);
			break;
		case 'keyPressUpdate':
			applyKeyPress(match, msg, socket);
			break;;
		case 'padelUpdate':
			sendPaddleUpdate(match, msg, socket, io);
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