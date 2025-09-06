import { UI, Game } from "../gameData.js"
import { OT, state } from '@shared/enums'
import { matchInfo } from '@shared/types'
import { updatePaddlePos, updateGameState } from '@shared/gameLogic'
import { aiAlgorithm } from './aiLogic.js'
import { navigateTo } from "../history.js"
import { sendGameState} from './gameStateSync.js'
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
		// console.log("UpdateDOMElements()");
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
		Game.match.state = state.Playing;
		ballDiv.style.animation = 'none';
		Game.match.pauseTimeOutID = null;
	}, duration);
}

export function game(match : matchInfo) {
	// console.log('Game', Game.match.state, match.mode);
	if (Game.match.state !== state.Playing) {
		return;
	}
	if (match.mode == OT.Online) {
		//update own paddle immediately in frontend
		const paddle = match.player1.ID == UI.user1.ID ? match.gameState.paddle1 : match.gameState.paddle2;
		console.log("ball", match.gameState.ball);
		renderGameInterpolated();
		updatePaddlePos(paddle, match.gameState.field);
	}
	else {
		match.time = performance.now();
		if (match.mode == OT.ONEvsCOM) {
			aiAlgorithm();
		}
		updateGameState(match);
		sendGameState();
	}
	updateDOMElements(match);
}
