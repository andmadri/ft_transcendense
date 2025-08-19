import * as S from './structs.js'
import { Game } from "./gameData.js"
import { sendKeyPressUpdate } from './Game/gameStateSync.js';
import { OT } from '@shared/enums'

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

export function releaseButton(e: KeyboardEvent) {
	if (Game.match.opponentType == OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		return ;
	}
	if (Game.match.opponentType == OT.Online && (e.key === 'w' || e.key === 's')) {
		return ;
	}
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		S.Keys[e.key].pressed = false;
		if (Game.match.opponentType == OT.Online) {
			sendKeyPressUpdate(e.key);
		}
	}
}

export function pressButton(e: KeyboardEvent) {
	if (Game.match.opponentType == OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		return ;
	}
	if (Game.match.opponentType == OT.Online && (e.key === 'w' || e.key === 's')) {
		return ;
	}
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		console.log(`Key pressed ${e.key}`);
		S.Keys[e.key].pressed = true;
		if (Game.match.opponentType == OT.Online) {
			sendKeyPressUpdate(e.key);
		}
	}
}

export function initAfterResize() {
	const ballDiv = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	const fieldDiv = document.getElementById('field');
	const game = document.getElementById('game');

	if (ballDiv && rPlayer && lPlayer && fieldDiv && game) {
		const oldWidth = field.size.width;
		const oldHeight = field.size.height;
		const newWidth = fieldDiv.clientWidth;
		const newHeight = fieldDiv.clientHeight;

		field.size.width = newWidth;
		field.size.height = newHeight;

		ball.size.width = ballDiv.clientWidth;
		ball.size.height = ballDiv.clientHeight;

		const relativeXball = ball.pos.x / oldWidth;
		const relativeYball = ball.pos.y / oldHeight;

		ball.pos.x = relativeXball * newWidth;
		ball.pos.y = relativeYball * newHeight;
		ballDiv.style.left = `${ball.pos.x}px`;
		ballDiv.style.top = `${ball.pos.y}px`;
		ball.movement.speed = field.size.width * 0.01;
		
		const relativeXlPlayer = paddle1.pos.x / oldWidth;
		const relativeYlPlayer = paddle1.pos.y / oldHeight;

		paddle1.size.width = lPlayer.clientWidth;
		paddle1.size.height = lPlayer.clientHeight;
		paddle1.pos.x = relativeXlPlayer * newWidth;
		paddle1.pos.y = relativeYlPlayer * newHeight;
		lPlayer.style.left = `${paddle1.pos.x}px`;
		lPlayer.style.top = `${paddle1.pos.y}px`;
		paddle1.movement.speed = field.size.height * 0.015;

		const relativeXrPlayer = paddle2.pos.x / oldWidth;
		const relativeYrPlayer = paddle2.pos.y / oldHeight;

		paddle2.size.width = rPlayer.clientWidth;
		paddle2.size.height = rPlayer.clientHeight;
		paddle2.pos.x = relativeXrPlayer * newWidth;
		paddle2.pos.y = relativeYrPlayer * newHeight;
		rPlayer.style.left = `${paddle2.pos.x}px`;
		rPlayer.style.top = `${paddle2.pos.y}px`;
		paddle2.movement.speed = field.size.height * 0.015;

	} else {
		console.log('Something went wrong (initAfterResizing), close game?');
	}
}