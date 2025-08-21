import * as S from './structs.js'
import { Game } from "./gameData.js"
import { sendKeyPressUpdate } from './Game/gameStateSync.js';
import { OT } from '@shared/enums'

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

export function releaseButton(e: KeyboardEvent) {
	if (Game.match.mode == OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		return ;
	}
	if (Game.match.mode == OT.Online && (e.key === 'w' || e.key === 's')) {
		return ;
	}
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		S.Keys[e.key].pressed = false;
		if (Game.match.mode == OT.Online) {
			sendKeyPressUpdate(e.key);
		}
	}
}

export function pressButton(e: KeyboardEvent) {
	if (Game.match.mode == OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		return ;
	}
	if (Game.match.mode == OT.Online && (e.key === 'w' || e.key === 's')) {
		return ;
	}
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		console.log(`Key pressed ${e.key}`);
		S.Keys[e.key].pressed = true;
		if (Game.match.mode == OT.Online) {
			sendKeyPressUpdate(e.key);
		}
	}
}

export function initAfterResize() {
	const ballRadius = ball.size.height / 2;
	const paddleHalfWidth = paddle1.size.width / 2;
	const paddleHalfHeight = paddle1.size.height / 2;
	const ballDiv = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	const fieldDiv = document.getElementById('field');
	const game = document.getElementById('game');

	if (ballDiv && rPlayer && lPlayer && fieldDiv && game) {
		const newWidth = fieldDiv.clientWidth;
		const newHeight = fieldDiv.clientHeight;

		ballDiv.style.left = `${(ball.pos.x * newWidth) - (ballRadius * newWidth)}px`;
		ballDiv.style.top = `${(ball.pos.y * newWidth) - (ballRadius * newWidth)}px`;
		lPlayer.style.left = `${paddle1.pos.x * newWidth - (paddleHalfWidth * newWidth)}px`;
		lPlayer.style.top = `${paddle1.pos.y * newWidth - (paddleHalfHeight * newWidth)}px`;
		rPlayer.style.left = `${paddle2.pos.x * newWidth - (paddleHalfWidth * newWidth)}px`;
		rPlayer.style.top = `${paddle2.pos.y * newWidth - (paddleHalfHeight * newWidth)}px`;

	} else {
		console.log('Something went wrong (initAfterResizing), close game?');
	}
}