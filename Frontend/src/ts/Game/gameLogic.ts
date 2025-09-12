import { UI, Game } from "../gameData.js"
import { OT, state } from '@shared/enums'
import { matchInfo, gameState } from '@shared/types'
import { updatePaddlePos, updateGameState } from '@shared/gameLogic'
import { aiAlgorithm } from './aiLogic.js'
import { renderGameInterpolated } from "./renderSnapshots.js"

export function updateDOMElements(match : matchInfo) {
	const gameState = match.gameState;
	const ballRadius = gameState.ball.size.height / 2;
	const paddleHalfHeight = gameState.paddle1.size.height / 2;

	//divElements
	const paddle1Div = document.getElementById('lPlayer');
	const paddle2Div = document.getElementById('rPlayer');
	const ballDiv = document.getElementById('ball');
	const leftScore = document.getElementById('leftScore');
	const rightScore = document.getElementById('rightScore');
	const fieldDiv = document.getElementById('field');

	if (ballDiv && paddle1Div && paddle2Div && leftScore && rightScore && fieldDiv) {
		leftScore.textContent = match.player1.score.toString();
		rightScore.textContent = match.player2.score.toString();

		ballDiv.style.left = `${(gameState.ball.pos.x * fieldDiv.clientWidth) - (ballRadius * fieldDiv.clientWidth)}px`; // i dont understand why i shouldn't subtract radius but it only works like this
		ballDiv.style.top = `${(gameState.ball.pos.y * fieldDiv.clientWidth) - (ballRadius * fieldDiv.clientWidth)}px`;
		
		paddle1Div.style.top = `${(gameState.paddle1.pos.y * fieldDiv.clientWidth) - (paddleHalfHeight * fieldDiv.clientWidth)}px`;
		paddle2Div.style.top = `${(gameState.paddle2.pos.y * fieldDiv.clientWidth) - (paddleHalfHeight * fieldDiv.clientWidth)}px`;
	}
}

export function pauseBallTemporarily(duration: number) {
	const ballDiv = document.getElementById('ball');
	if (!ballDiv)
		return;
	ballDiv.style.animation = 'twinkle 1s ease-in-out infinite';
	Game.match.pauseTimeOutID = setTimeout(() => {
		Game.match.state = state.Serve;
		ballDiv.style.animation = 'none';
		Game.match.pauseTimeOutID = null;
	}, duration);
}

export function reconcilePaddle(playerNr : number, serverGameState : gameState) {
	const paddle = playerNr == 1 ? Game.match.gameState.paddle1 : Game.match.gameState.paddle2;
	const serverPaddle = playerNr == 1 ? serverGameState.paddle1 : serverGameState.paddle2;

	const diff = serverPaddle.pos.y - paddle.pos.y;
	if (Math.abs(diff) > 0.1) {
		paddle.pos.y += diff * 0.02;
	}
}

export function game(match : matchInfo) {
	let now = performance.now();
	if (!match.lastUpdateTime) {
		match.lastUpdateTime = now;
		return;
	}
	let deltaTime = (now - match.lastUpdateTime) / 750;
	switch (match.mode) {
		case OT.Online : {
			const paddle = match.player1.ID == UI.user1.ID ? match.gameState.paddle1 : match.gameState.paddle2;
			renderGameInterpolated();
			updatePaddlePos(paddle, match.gameState.field, deltaTime);
			break ;
		}
		case OT.ONEvsCOM : {
			aiAlgorithm(match);
		}
		case OT.ONEvsONE : {
			if (match.state != state.Paused) {
				updateGameState(match, deltaTime);
			}
			else {
				updatePaddlePos(match.gameState.paddle1, match.gameState.field, deltaTime);
				updatePaddlePos(match.gameState.paddle2, match.gameState.field, deltaTime);
			}
			break;
		}
	}
	match.lastUpdateTime = now;
	updateDOMElements(match);
}
