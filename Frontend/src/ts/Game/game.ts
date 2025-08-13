import { applyBallUpdate, applyPaddleUpdate } from "./gameStateSync.js";
import { log } from '../logging.js'
import { Game } from "../script.js";
import * as S from "../structs.js";
import { getGameField } from "./gameContent.js";
// import { receiveUpdateFromServer } from "./updateServer.js";

function processMatch(data: any) {
	console.log("inited game with id: " + data.id);
	console.log("players: " + data.player1ID + " " + data.player2ID);
	Game.matchID = data.id;
	Game.player1Id = data.player1ID;
	Game.player2Id = data.player2ID;

	if (Game.opponentType == S.OT.Online) {
		getGameField();
	}
	// init or game? Server has send msg that init backend is ready. Now we need the gameloop but with
	// the game field as well
	Game.state = S.State.Game;
	log("ProcessMatch");
}

function processSavingMatch(data: any) {
	if (data.success)
		log("Save match successful");
	else
		log("Something went wrong saving match");
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
			log(`MatchID frontend: ${data.id}`)
			processMatch(data);
			break ;
		case 'start':
			Game.state = S.State.Game;
			break ;
		case 'ballUpdate':
 			applyBallUpdate(data);
			break ;
		case 'padelUpdate':
			applyPaddleUpdate(data);
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