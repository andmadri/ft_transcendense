import * as S from '../structs.js';
import { matchInfo } from '@shared/types';

export const AI: S.AIInfo = {
	prediction : { 
		x : 0, 
		y : 0,
		errorMargin : 0.05
	},
	reactionTime : 1000, //ms
	lastView : 0
}

export function resetAI(match : matchInfo) {
	const { paddle2 } = match.gameState;
	AI.lastView = 0;
	AI.prediction.x = paddle2.pos.x;
	AI.prediction.y = paddle2.pos.y;
	AI.prediction.errorMargin = 0.05;
}

function	followBall(match: matchInfo) {
	const { paddle2, ball, field } = match.gameState;
	const threshold = paddle2.size.height * 0.1;
	
	if (Math.abs(ball.pos.y - paddle2.pos.y) < threshold) {
		return ;
	}
	AI.prediction.x = paddle2.pos.x;
	AI.prediction.y = ball.pos.y;
}

function setErrorMargin(match: matchInfo){
	const diff = match.player1.score - match.player2.score;
	const base = 0.05;
	const step = 0.01;
	const min = 0;
	const max = 0.1;

	const margin = base + diff * step;
	AI.prediction.errorMargin = Math.max(Math.min(max, margin), min);
}

function	predictBall(match: matchInfo) {
	const { ball, field, paddle2 } = match.gameState;

	const ballCopy = { x: ball.pos.x, y: ball.pos.y, vy: ball.velocity.vy, vx: ball.velocity.vx};
	const ballRadius = ball.size.width / 2;
	const paddleHalfHeight = paddle2.size.height / 2;
	const paddleHalfWidth = paddle2.size.width / 2;

	//simulate ball movement to anticipate bounces
	while (ballCopy.x + ballRadius < paddle2.pos.x - paddleHalfWidth) {
		ballCopy.x += ballCopy.vx;
		ballCopy.y += ballCopy.vy;
		if (ballCopy.y <= 0 || ballCopy.y >= field.size.height) {
			ballCopy.y = Math.max(0, Math.min(ballCopy.y, field.size.height));
			ballCopy.vy *= -1;
		}
	}
	AI.prediction.x = paddle2.pos.x;
	AI.prediction.y = Math.min(Math.max(paddleHalfHeight, ballCopy.y), field.size.height - paddleHalfHeight);
}

function	predictAction(match: matchInfo) {
	//calculate dx and dy
	const { ball, paddle2  } = match.gameState;
	if (ball.velocity.vx <= 0) {
		followBall(match);
	}
	else {
		predictBall(match);
	}

	//add error margin
	setErrorMargin(match);
	const distance = Math.abs(AI.prediction.y - paddle2.pos.y);
	const errorOffset = Math.random() * Math.random() * AI.prediction.errorMargin * distance;
	const sign = Math.random() < 0.5 ? -1 : 1;
	const offset = errorOffset * sign;

	AI.prediction.y += offset;
}

export function aiAlgorithm(match: matchInfo){
	const { paddle2 } = match.gameState;

	const paddleCenter = paddle2.pos.y;
	if (match.lastUpdateTime - AI.lastView > AI.reactionTime) {
		AI.lastView = match.lastUpdateTime;
		predictAction(match);
		//hesitation chance
		if (Math.random() < 0.2) {
			paddle2.velocity.vy = 0;
			return;
		}
	}

	const threshold = paddle2.size.height * 0.1;
	if (AI.prediction.y > paddleCenter + threshold) {
		paddle2.velocity.vy = paddle2.movement.speed;
	} else if (AI.prediction.y < paddleCenter - threshold) {
		paddle2.velocity.vy = -paddle2.movement.speed;
	} else {
		paddle2.velocity.vy = 0;
	}
}
