import { applyGameStateUpdate, applyKeyPressUpdate, updateMatchEventsDB, applyScoreUpdate } from "./gameStateSync.js";
import { saveMatch, quitMatch } from "../End/endGame.js";
import { matches } from '../InitGame/match.js';

export async function handleGame(msg, socket, io) {
	if (!msg.subaction)
		return handleError('MSG_MISSING_SUBACTION', 'Invalid message format', 'missing subaction', msg, 'handleGame');

	if (!msg.matchID)
		return console.error('NO_MATCH_ID - No matchID found in message from frontend:', msg);

	const match = matches.get(msg.matchID);
	if (!match)
		return console.error('MATCH_NOT_FOUND', `No match found with matchID: ${msg.matchID}`, 'handleGame');

	switch (msg.subaction) {
		case 'gameStateUpdate':
			applyGameStateUpdate(match, msg);
			break;
		case 'serve':
			updateMatchEventsDB(match, msg.gameState, "serve");
			break;
		case 'padelHit':
			updateMatchEventsDB(match, msg.gameState, "hit");
			break;
		case 'scoreUpdate':
			applyScoreUpdate(match, msg);
			updateMatchEventsDB(match, msg.gameState, "goal");
			break;
		case 'keyPressUpdate':
			applyKeyPressUpdate(match, msg, socket);
			break;
		case 'save':
			if (match && match.winnerID) {
				saveMatch(match.matchID, match.winnerID);
			} else {
				saveMatch(match.matchID, null);
			}
			break ;
		case 'quit':
			quitMatch(match, msg, socket, io);
			break;
		default:
			handleError('MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', msg.subaction, 'handleGame');
	}
}