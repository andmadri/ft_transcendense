import { Game } from "../gameData.js";
import { OT, state } from '@shared/enums';
import { navigateTo } from "../history.js";
import { applyGameStateUpdate, applyScoreUpdate, applyWinner } from './gameStateSync.js';

function processMatch(data: any) {
	Game.match.matchID = data.id;
	Game.match.player1.ID = data.player1ID;
	Game.match.player2.ID = data.player2ID;
	navigateTo('Game');
}

function processQuitMatch(data: any) {
	Game.match.winnerID = data.winner;
	if (Game.match.OT !== OT.Online) {
		Game.match.state = state.End;
	}
	console.log('QuitMatch:', data.reason);
}

export function actionGame(data: any) {
	if (!data.subaction) {
		console.error('MSG_MISSING_SUBACTION', 'Invalid message format', 'missing subaction', data, 'actionGame');
		return ;
	}
	switch(data.subaction) {
		case 'init':
			processMatch(data);
			break ;
		case 'gameStateUpdate':
			applyGameStateUpdate(data);
			break ;
		case 'scoreUpdate':
			applyScoreUpdate(data);
			break;
		case 'winner':
			applyWinner(data);
			break;
		case 'quit':
			processQuitMatch(data);
			break ;
		default:
			console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', data.subaction, 'actionGame');
	}
}