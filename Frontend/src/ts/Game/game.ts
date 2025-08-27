import { log } from '../logging.js'
import { UI, Game } from "../gameData.js"
import * as S from "../structs.js";
import { getGameField } from "./gameContent.js"
import { OT, state } from '@shared/enums'
import { applyGameStateUpdate, applyScoreUpdate } from './gameStateSync.js'

// import { receiveUpdateFromServer } from "./updateServer.js";

function processMatch(data: any) {
	console.log("inited game with id: " + data.id);
	console.log("players: " + data.player1ID + " " + data.player2ID);
	Game.match.ID = data.id;
	Game.match.player1.ID = data.player1ID;
	Game.match.player2.ID = data.player2ID;

	if (Game.match.mode == OT.Online) {
		getGameField();
	}

	// init or game? Server has send msg that init backend is ready. Now we need the gameloop but with
	// the game field as well
	UI.state = S.stateUI.Game;
	Game.match.state = state.Init;
	log("ProcessMatch");
}

function processSavingMatch(data: any) {
	if (data.success)
		log("Save match successful");
	else
		log("Something went wrong saving match");
}

function processQuitMatch(data: any) {
	Game.match.state = state.End; //maybe do something here with state.Interrupt to save the winner? 
	log(data.reason);
}


export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'init':
			log(`MatchID frontend: ${data.id}`)
			processMatch(data);
			break ;
		case 'start':
			UI.state = S.stateUI.Game;
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