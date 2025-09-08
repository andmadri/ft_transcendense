import * as S from '../structs.js'
import { Game } from "../gameData.js"
import { matchInfo } from '@shared/types'

export const AI: S.AIInfo = {
	prediction : { 
		x : 0, 
		y : 0,
		dx : 0, 
		dy : 0 
	},
	reactionTime : 1000, //ms
	lastView : 0,
	tick : 0
}

export function resetAI(match : matchInfo) {
	const { paddle2 } = match.gameState;
	AI.lastView = 0;
	AI.prediction.x = paddle2.pos.x;
	AI.prediction.y = paddle2.pos.y;
	AI.prediction.dx = 0;
	AI.prediction.dy = 0;

}

function	followBall(match : matchInfo, dx : number, dy : number) {
	const { paddle2, ball, field } = match.gameState;
	const threshold = field.size.height * 0.5;
	
	if (Math.abs(ball.pos.y - paddle2.pos.y) < threshold) {
		return;
	}
	AI.prediction = {
		x : paddle2.pos.x,
		y : ball.pos.y,
		dx : dx,
		dy : dy,
	}
}

function	predictBall(match : matchInfo, dx : number, dy : number) {

	const { ball, field, paddle2 } = match.gameState;

	const ballCopy = { x: ball.pos.x, y: ball.pos.y};
	const ballRadius = ball.size.width / 2;

	//simulate ball movement to anticipate bounces
	while (ballCopy.x + ballRadius < paddle2.pos.x - paddle2.size.width / 2) {
		ballCopy.x += dx;
		ballCopy.y += dy;
		if (ballCopy.y <= 0 || ballCopy.y >= field.size.height) {
			ballCopy.y = Math.max(0, Math.min(ballCopy.y, field.size.height));
			dy *= -1;
		}
	}
	
	//add error margin
	let errorMargin = 0.15;
	const errorOffset = Math.random() * field.size.height * errorMargin;
	const sign = Math.random() < 0.5 ? -1 : 1;
	const Offset = errorOffset * sign;
	const predictedY = ballCopy.y; + Offset;

	AI.prediction = {
		x : paddle2.pos.x,
		y : predictedY,
		dx : dx,
		dy : dy,
	}
}

function	predictAction(match : matchInfo) {
	//calculate dx and dy

	const { ball } = match.gameState;
	const dx = ball.velocity.vx * ball.movement.speed;
	const dy = ball.velocity.vy * ball.movement.speed;

	if (dx <= 0) {
		followBall(match, dx, dy);
		return;
	}
	else {
		predictBall(match, dx, dy);
	}
}

export function aiAlgorithm(match : matchInfo){
	const { paddle2 } = match.gameState;

	const paddleCenter = paddle2.pos.y + paddle2.size.height / 2;
	if (match.gameState.time - AI.lastView > AI.reactionTime) {
		AI.lastView = match.gameState.time;
		predictAction(match);
	}
	if (AI.prediction.y > paddleCenter + paddle2.size.height * 0.1) {
		paddle2.velocity.vy = 1 * paddle2.movement.speed;
	}
	else if (AI.prediction.y < paddleCenter - paddle2.size.height * 0.1) {
		paddle2.velocity.vy = -1 * paddle2.movement.speed;
	}
	else {
		paddle2.velocity.vy = 0;
	}
	// test needs work
	// const hesitationChance = 0.1;
	// const wrongDirChance = 0.1;
	// if (Math.random() < hesitationChance) {
	// 	paddle2.velocity.vy = 0;
	// }
	// else if (Math.random() < wrongDirChance) {
	// 	paddle2.velocity.vy *= -1;
	// }

}
