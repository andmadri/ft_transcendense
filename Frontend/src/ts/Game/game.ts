import { processBallUpdate, processPadelUpdate } from "./gameLogic.js";
import { log } from '../logging.js'
import { Game } from "../script.js";
import * as S from "../structs.js";

function processMatch(data: any) {
	log("inited game with id: " + data.id);
	Game.matchID = data.id;
	Game.id = data.player1ID;
	Game.id2 = data.player2ID;
	Game.state = S.State.Game;
	log("ProcessMatch?");
}

function processSavingMatch(data: any) {
	if (data.success)
		log("Save match successful");
	else
		log("Something went wrong saving match");
	Game.state = S.State.Menu;
}

function processQuitMatch(data: any) {
	Game.state = S.State.End;
	log(data.reason);
}


export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'init':
			processMatch(data);
			break ;
		case 'ballUpdate':
 			processBallUpdate(data);
			break ;
		case 'padelUpdate':
			processPadelUpdate(data);
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