import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { renderGameInterpolated } from './renderSnapshots.js';

const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos } = S.pos;
const { field : fieldMove, ball: ballMove, lPlayer: lPlayerMove, rPlayer: rPlayerMove } = S.movement;

export function applyBallUpdate(data: any) {
	if (Game.opponentType == S.OT.Online) {
		renderGameInterpolated(data);
		return ;
	}

	if ('ballX' in data) {
		const ball = document.getElementById('ball');
		if (ball && typeof data.ballX === 'number')
			ballPos.x = data.ballX;
		if (ball && typeof data.ballY === 'number')
			ballPos.y = data.ballY;
	}
}

export function applyPaddleUpdate(data: any) {
	if (Game.opponentType == S.OT.Online) {
		renderGameInterpolated(data);
		return ;
	}

	if ('rPlayerX' in data) {
		const rPlayer = document.getElementById('rPlayer');
		if (rPlayer && typeof data.playerOneX === 'number')
			rPlayerPos.x = data.playerOneX;
		if (rPlayer && typeof data.playerOneY === 'number')
			rPlayerPos.y = data.playerOneY;		
	}
	if ('lPlayerX' in data) {
		const lPlayer = document.getElementById('lPlayer');
		if (lPlayer && typeof data.playerTwoX === 'number')
			lPlayerPos.x = data.playerTwoX;
		if (lPlayer && typeof data.playerTwoY === 'number')
			lPlayerPos.y = data.playerTwoY;
	}
}

export function sendKeyPressUpdate(key : string) {
	const msg = {
		action: 'game',
		subaction: 'keyPressUpdate',
		key: key,
		pressed: S.Keys[key].pressed,
		id: Game.player1Id,
		matchID: Game.matchID };
	Game.socket.send(JSON.stringify(msg));
	// Send also ballX/Y ballVX/Y and paddleVy
}

//change this to sendGameState and send everything at once
//normalise data before sending
export function sendPaddleUpdate() {
	const leftPadel = document.getElementById('lPlayer');
	const rightPadel = document.getElementById('rPlayer');
	if (Game.socket.connected) //what is this for?
		return ;
	if (leftPadel && rightPadel) {

		Game.socket.send({
			action: 'game',
			subaction: 'padelUpdate',
			lHeight: leftPadel.offsetTop,
			rHeight: rightPadel.offsetTop,
			matchID: Game.matchID
		});

	} else {
		console.log('No lP ot rP');
	}
}

export function sendBallUpdate() {
	Game.socket.send({ 
		action: 'game',
		subaction: 'ballUpdate',
		ballY: ballPos.y,
		ballX: ballPos.x,
		matchID: Game.matchID 
	});
	// Send also ballVY/X 
}

export function sendScoreUpdate(id: number) {
	Game.socket.send({
		action: 'game',
		subaction: 'scoreUpdate',
		player: id,
		matchID: Game.matchID
	});
}




export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'ballUpdate':
			applyBallUpdate(data);
			break ;
		case 'padelUpdate':
			applyPaddleUpdate(data);
			break ;
		default:
			log(`(actionGame) Unknown action: ${data.subaction}`);
	}
}