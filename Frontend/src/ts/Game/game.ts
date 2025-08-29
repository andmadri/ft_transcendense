import { log } from '../logging.js'
import { UI, Game } from "../gameData.js"
import * as S from "../structs.js";
import { getGameField } from "./gameContent.js"
import { OT, Stage } from '@shared/enums'
import { navigateTo } from "../history.js";
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
	navigateTo('Game');
	log("ProcessMatch");
}

function processSavingMatch(data: any) {
	if (data.success)
		log("Save match successful");
	else
		log("Something went wrong saving match");
}

function processQuitMatch(data: any) {
	navigateTo('Menu');
	log(data.reason);
}


export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'init':
			log(`MatchID frontend: ${data.id}`); // MARTY: WHERE IS THIS LOG USED FOR?
			processMatch(data);
			break ;
		case 'start':
			UI.state = S.stateUI.Game;
			break ;
		case 'ballUpdate':
 			//applyBallUpdate(data);
			break ;
		case 'padelUpdate':
			//applyPaddleUpdate(data);
			break ;
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