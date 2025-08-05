import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'

const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos } = S.pos;
const { field : fieldMove, ball: ballMove, lPlayer: lPlayerMove, rPlayer: rPlayerMove } = S.movement;

export function applyBallUpdate(data: any) {
	if ('ballX' in data) {
		const ball = document.getElementById('ball');
		if (ball && typeof data.ballX === 'number')
			ball.style.left = `${data.ballX}px`;
		if (ball && typeof data.ballY === 'number')
			ball.style.top = `${data.ballY}px`;
	}
}

export function applyPaddleUpdate(data: any) {
	if ('rPlayerX' in data) {
		const rPlayer = document.getElementById('rPlayer');
		if (rPlayer && typeof data.playerOneX === 'number')
			rPlayer.style.left = `${data.playerOneX}px`;
		if (rPlayer && typeof data.playerOneY === 'number')
			rPlayer.style.top = `${data.playerOneY}px`;
		rPlayerPos.y = data.playerOneY;
		
	}
	if ('lPlayerX' in data) {
		const lPlayer = document.getElementById('lPlayer');
		if (lPlayer && typeof data.playerTwoX === 'number')
			lPlayer.style.left = `${data.playerTwoX}px`;
		if (lPlayer && typeof data.playerTwoY === 'number')
			lPlayer.style.top = `${data.playerTwoY}px`;
		lPlayerPos.y = data.playerTwoY;
	}
}

export function sendPaddleUpdate() {
	const leftPadel = document.getElementById('lPlayer');
	const rightPadel = document.getElementById('rPlayer');
	if (Game.socket.readyState != WebSocket.OPEN)
		return ;
	if (leftPadel && rightPadel) {
		const msg = { 
			action: 'game',
			subaction: 'padelUpdate',
			lHeight: leftPadel.offsetTop,
			rHeight: rightPadel.offsetTop };
		Game.socket.send(JSON.stringify(msg));
	} else {
		console.log('No lP ot rP');
	}
}

export function sendBallUpdate() {
	const msg = { 
		action: 'game',
		subaction: 'ballUpdate',
		ballY: ballPos.y,
		ballX: ballPos.x };
	Game.socket.send(JSON.stringify(msg));
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