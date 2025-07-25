import * as S from '../structs.js'
import { Game } from '../script.js'
import { movePadel } from './gameLogic.js'

export const AI: S.AIInfo = {
	prediction : null,
	reactionTime : 1000, //ms
	lastView : 0,
	targetDirection : 'ArrowUp'
};

export function resetAI() {
	AI.prediction = null;
	AI.lastView = 0;
	AI.targetDirection = 'noAction';
}

function	followBall(dx : number, dy : number) {
	const ball = S.Objects['ball'];
	const paddle = S.Objects['rPlayer'];
	const field = S.Objects['field'];

	const threshold = field.height * 0.01;
	
	console.log("difference: ", Math.abs(ball.y - paddle.y), "Threshold: ", threshold);
	if (Math.abs(ball.y - paddle.y) < threshold) {
		return;
	}
	AI.prediction = {
		x : paddle.x,
		y : ball.y,
		dx : dx,
		dy : dy,
	}
}

function	predictBall(dx : number, dy : number) {
	const ball = S.Objects['ball'];
	const ballRadius = ball.width / 2;
	const field = S.Objects['field'];
	const paddle = S.Objects['rPlayer'];

	const ballCopy = {angle: ball.angle, speed: ball.speed, x: ball.x, y: ball.y, width: ball.width, height: ball.height, color: "white"};

	//simulate ball movement to anticipate bounces
	while (ballCopy.x + ballRadius < paddle.x) {
		ballCopy.x += dx;
		ballCopy.y += dy;
		if (ballCopy.y <= 0 || ballCopy.y >= field.height) {
			ballCopy.y = Math.max(0, Math.min(ballCopy.y, field.height));
			dy *= -1;
		}
	}
	
	//add error margin
	let errorMargin = 0.01;
	const errorOffset = Math.random() * field.height * errorMargin;
	const sign = Math.random() < 0.5 ? -1 : 1;
	const Offset = errorOffset * sign;

	//clamp y to stay within field
	const predictedY = ballCopy.y + Offset;

	AI.prediction = {
		x : paddle.x,
		y : predictedY,
		dx : dx,
		dy : dy,
	}
}

function	predictAction() {
	const ball = S.Objects['ball'];

	//calculate dx and dy
	const dx = Math.cos(ball.angle) * ball.speed;
	const dy = Math.sin(ball.angle) * ball.speed;

	if (dx <= 0) {
		followBall(dx, dy);
		return;
	}
	else {
		predictBall(dx, dy);
	}
}

export function aiAlgorithm() {
	const ball = S.Objects['ball'];
	const paddle = S.Objects['rPlayer'];
	const field = S.Objects['field'];

	if (Game.timeGame - AI.lastView > AI.reactionTime) {
		AI.lastView = Game.timeGame;
		predictAction()
	}
	
	if (AI.prediction) {
		if (AI.prediction.y > paddle.y + paddle.height) {
			AI.targetDirection = 'ArrowDown';
			movePadel(AI.targetDirection);
		}
		else if (AI.prediction.y < paddle.y) {
			AI.targetDirection = 'ArrowUp';
			movePadel(AI.targetDirection);
		}
	}
}
