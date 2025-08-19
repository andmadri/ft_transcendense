import * as S from '../structs.js'
import { Game } from "../gameData.js"
import { movePadel } from './gameLogic.js'

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

export const AI: S.AIInfo = {
	prediction : { 
		x : paddle2.pos.x, 
		y : paddle2.pos.y, 
		dx : 0, 
		dy : 0 },
	reactionTime : 1000, //ms
	lastView : 0,
	targetDirection : 'ArrowUp'
};

export function resetAI() {
	AI.lastView = 0;
}

function	followBall(dx : number, dy : number) {

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

function	predictBall(dx : number, dy : number) {

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
	let errorMargin = 0.06;
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

function	predictAction() {
	//calculate dx and dy
	const dx = ball.velocity.vx * ball.speed;
	const dy = ball.velocity.vy * ball.speed;

	if (dx <= 0) {
		followBall(dx, dy);
		return;
	}
	else {
		predictBall(dx, dy);
	}
}

export function aiAlgorithm() : boolean {

	const paddleCenter = paddle2.pos.y + paddle2.size.height / 2;

	if (Game.match.time - AI.lastView > AI.reactionTime) {
		AI.lastView = Game.match.time;
		predictAction()
	}
	if (AI.prediction.y > paddleCenter + paddle2.size.height * 0.1) {
		movePadel('ArrowDown');
		return true;
	}
	else if (AI.prediction.y < paddleCenter - paddle2.size.height * 0.1) {
		movePadel('ArrowUp');
		return true;
	}
	return false;
}
