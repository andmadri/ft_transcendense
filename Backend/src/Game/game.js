import { applyGameStateUpdate, applyKeyPressUpdate, updateMatchEventsDB, applyScoreUpdate } from "./gameStateSync.js";
import { saveMatch, quitMatch } from "../End/endGame.js";
import { matches } from '../InitGame/match.js';

export async function handleGame(db, msg, socket, io) {
	if (!msg.subaction)
		return console.log('no subaction in handleGame');

	// we need to have a matchID by now
	if (!msg.matchID) {
		console.log("No matchID found in msg from frontend");
		console.log(msg);
		return ;
	}

	const match = matches.get(msg.matchID);
	if (!match)
		return console.error(`No match found with ${msg.matchID}`);

	// Updates that are comming into the backend (Maybe better to update all in once)
	switch (msg.subaction) {
		case 'gameStateUpdate':
			applyGameStateUpdate(match, msg);
			break;
		case 'serve':
			updateMatchEventsDB(match, msg, msg.gameState, "serve");
			break;
		case 'padelHit':
			updateMatchEventsDB(match, msg, msg.gameState, "hit");
			break;
		case 'scoreUpdate':
			applyScoreUpdate(match, msg);
			updateMatchEventsDB(match, msg, msg.gameState, "goal");
			break;
		case 'keyPressUpdate':
			applyKeyPressUpdate(match, msg, socket);
			break;
		case 'save':
			saveMatch(match, msg, socket);
			if (match.tournamentId) {
				await reportTournamentMatchResult(match.tournamentId, match.tournamentMatchNumber, match);
				await triggerNextTournamentMatch(match.tournamentId, io);
			}
			break ;
		case 'quit':
			quitMatch(match, msg, socket, io);
			if (match.tournamentId) {
				await reportTournamentMatchResult(match.tournamentId, match.tournamentMatchNumber, match);
				await triggerNextTournamentMatch(match.tournamentId, io);
			}
			break;
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}