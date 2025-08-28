import * as S from './structs.js'
import { Game, UI } from "./gameData.js"
import { sendKeyPressUpdate } from './Game/gameStateSync.js';
import { OT, state } from '@shared/enums'

export function releaseButton(e: KeyboardEvent) {
	const paddle1 = Game.match.gameState.paddle1;
	const paddle2 = Game.match.gameState.paddle2;
	if (Game.match.state != state.Playing) {
		return ;
	}
	if (Game.match.mode == OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		paddle1.velocity.vy = 0;
		return ;
	}
	if (Game.match.mode == OT.Online && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		const myPaddle = UI.user1.ID == Game.match.player1.ID ? paddle1 : paddle2;
		myPaddle.velocity.vy = 0;
		S.Keys[e.key].pressed = false;
		sendKeyPressUpdate(e.key);
		return ;
	}
	if (Game.match.mode == OT.ONEvsONE && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		paddle2.velocity.vy = 0;
		return;
	}
	if (Game.match.mode == OT.ONEvsONE && (e.key === 'w' || e.key === 's')) {
		paddle1.velocity.vy = 0;
		return;
	}
}

export function pressButton(e: KeyboardEvent) {
	const paddle1 = Game.match.gameState.paddle1;
	const paddle2 = Game.match.gameState.paddle2;
	if (Game.match.state != state.Playing) {
		return ;
	}
	if (Game.match.mode == OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		paddle1.velocity.vy = S.Keys[e.key].dir * paddle1.movement.speed;
		return;
	}
	if (Game.match.mode == OT.Online && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		const myPaddle = UI.user1.ID == Game.match.player1.ID ? paddle1 : paddle2;
		myPaddle.velocity.vy = S.Keys[e.key].dir * myPaddle.movement.speed;
		S.Keys[e.key].pressed = true;
		sendKeyPressUpdate(e.key);
		return;
	}
	if (Game.match.mode == OT.ONEvsONE && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		paddle2.velocity.vy = S.Keys[e.key].dir * paddle2.movement.speed;
		return;
	}
	if (Game.match.mode == OT.ONEvsONE && (e.key === 'w' || e.key === 's')) {
		paddle1.velocity.vy = S.Keys[e.key].dir * paddle1.movement.speed;
		return;
	}
}

export function initAfterResize() {
	const paddle1 = Game.match.gameState.paddle1;
	const paddle2 = Game.match.gameState.paddle2;
	const ball = Game.match.gameState.ball;

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