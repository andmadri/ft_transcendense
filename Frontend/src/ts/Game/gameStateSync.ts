import * as S from '../structs.js'
import { Game } from "../gameData.js"
import { log } from '../logging.js'
import { OT } from '@shared/enums'
import { renderGameInterpolated } from './renderSnapshots.js';

// const field = Game.match.gameState.field;
// const ball = Game.match.gameState.ball;
// const paddle1 = Game.match.gameState.paddle1;
// const paddle2 = Game.match.gameState.paddle2;

// export function applyBallUpdate(data: any) {
// 	if (Game.match.mode == OT.Online) {
// 		renderGameInterpolated(data);
// 		return ;
// 	}

// 	if ('ballX' in data) {
// 		if (typeof data.ballX === 'number')
// 			ball.pos.x = data.ballX;
// 		if (ball && typeof data.ballY === 'number')
// 			ball.pos.y = data.ballY;
// 	}
// }

// export function applyPaddleUpdate(data: any) {
// 	if (Game.match.mode == OT.Online) {
// 		renderGameInterpolated(data);
// 		return ;
// 	}

// 	if ('rPlayerX' in data) {
// 		const rPlayer = document.getElementById('rPlayer');
// 		if (rPlayer && typeof data.playerOneX === 'number') //is right or left player player1???
// 			paddle2.pos.x = data.playerOneX;
// 		if (rPlayer && typeof data.playerOneY === 'number')
// 			paddle2.pos.y = data.playerOneY;		
// 	}
// 	if ('lPlayerX' in data) {
// 		const lPlayer = document.getElementById('lPlayer');
// 		if (lPlayer && typeof data.playerTwoX === 'number')
// 			paddle1.pos.x = data.playerTwoX;
// 		if (lPlayer && typeof data.playerTwoY === 'number')
// 			paddle1.pos.y = data.playerTwoY;
// 	}
// }

function applyGameStateUpdate(data : any) {
	if (Game.match.mode == OT.Online) {
		renderGameInterpolated(data);
		return ;
	}
}

export function sendKeyPressUpdate(key : string) {
	const msg = {
		action: 'game',
		subaction: 'keyPressUpdate',
		key: key,
		pressed: S.Keys[key].pressed,
		id: Game.match.player1.ID, //user check
		matchID: Game.match.ID };
	Game.socket.send(JSON.stringify(msg));
	// Send also ballX/Y ballVX/Y and paddleVy
}

export function sendGameState() {
	Game.socket.send({
		action: 'game',
		subaction: 'gameStateUpdate',
		matchID: Game.match.ID,
		gameState: Game.match.gameState
	});
}

export function sendScoreUpdate(id: number) {
	Game.socket.send({
		action: 'game',
		subaction: 'scoreUpdate',
		player: id,
		matchID: Game.match.ID
	});
}

export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'gameStateUpdate':
			applyGameStateUpdate(data);
		case 'ballUpdate':
			//applyBallUpdate(data);
			break ;
		case 'padelUpdate':
			//applyPaddleUpdate(data);
			break ;
		default:
			log(`(actionGame) Unknown action: ${data.subaction}`);
	}
}