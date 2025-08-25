import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { OT, state } from '@shared/enums'
import { entity, player } from '@shared/types'
import { updatePaddlePos, updateGameState } from '@shared/gameLogic'
import { aiAlgorithm, resetAI } from './aiLogic.js'
import { sendGameState, sendScoreUpdate} from './gameStateSync.js'

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

function updateDOMElements() {
	const ballRadius = ball.size.height / 2;
	const paddleHalfHeight = paddle1.size.height / 2;
	const paddle1Div = document.getElementById('lPlayer');
	const paddle2Div = document.getElementById('rPlayer');
	const ballDiv = document.getElementById('ball');
	const leftScore = document.getElementById('leftScore');
	const rightScore = document.getElementById('rightScore');
	const fieldDiv = document.getElementById('field');

	if (ballDiv && paddle1Div && paddle2Div && leftScore && rightScore && fieldDiv) {
		leftScore.textContent = Game.match.player1.score.toString();
		rightScore.textContent = Game.match.player2.score.toString();

		ballDiv.style.left = `${(ball.pos.x * fieldDiv.clientWidth)}px`; // i dont understand why i shouldn't subtract radius but it only works like this
		ballDiv.style.top = `${(ball.pos.y * fieldDiv.clientWidth)}px`;
		
		paddle1Div.style.top = `${(paddle1.pos.y * fieldDiv.clientWidth) - (paddleHalfHeight * fieldDiv.clientWidth)}px`;
		paddle2Div.style.top = `${(paddle2.pos.y * fieldDiv.clientWidth) - (paddleHalfHeight * fieldDiv.clientWidth)}px`;
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

export function game() {
	if (Game.match.mode == OT.Online) {
		//update own paddle immediately in frontend
		updatePaddlePos(paddle2, Game.match.gameState.field); // what paddle???
		updateDOMElements();
	}
	else {
		Game.match.time = performance.now();
		if (Game.match.player1.score == 5 || Game.match.player2.score == 5) {
			Game.match.state = state.End;
			return ;
		}
		if (Game.match.mode == OT.ONEvsCOM) {
			aiAlgorithm();
		}
		updateGameState(Game.match);
		sendGameState();
	}
	updateDOMElements();
}
