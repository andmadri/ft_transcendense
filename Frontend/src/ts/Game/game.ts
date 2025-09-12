import { log } from '../logging.js'
import { UI, Game } from "../gameData.js"
import * as S from "../structs.js";
import { getGameField } from "./gameContent.js"
import { OT, state } from '@shared/enums'
import { navigateTo } from "../history.js";
import { applyGameStateUpdate, applyScoreUpdate } from './gameStateSync.js'

// import { receiveUpdateFromServer } from "./updateServer.js";

function processMatch(data: any) {
	console.log("inited game with id: " + data.id);
	console.log("players: " + data.player1ID + " " + data.player2ID);
	Game.match.matchID = data.id;
	Game.match.player1.ID = data.player1ID;
	Game.match.player2.ID = data.player2ID;
	navigateTo('Game');
}

function processSavingMatch(data: any) {
	if (data.success)
		log("Save match successful");
	else
		log("Something went wrong saving match");
}

function processQuitMatch(data: any) {
	console.log("processQuitMatch()");
	Game.match.winnerID = data.winner;
	Game.match.state = state.End;
	log(data.reason);
}


export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'init':
			log(`MatchID frontend: ${data.id}`);
			processMatch(data);
			break ;
		case 'gameStateUpdate':
			applyGameStateUpdate(data);
			break ;
		case 'scoreUpdate':
			applyScoreUpdate(data);
			break;
		case 'save':
			processSavingMatch(data);
			break ;
		case 'quit':
			processQuitMatch(data);
			break ;
		default:
			log(`(actionGame) Unknown action: ${data.subaction}`);
	}
}