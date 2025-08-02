import * as S from '../structs.js'
import { Game } from '../script.js'
import { movePadel } from './gameLogic.js'

export const AI: S.AIInfo = {
	prediction : { 
		x : S.Objects['rPlayer'].x, 
		y : S.Objects['rPlayer'].y, 
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
	const ball = S.Objects['ball'];
	const paddle = S.Objects['rPlayer'];
	const field = S.Objects['field'];

	//const threshold = field.height * 0.5;
	
	// if (Math.abs(ball.y - paddle.y) < threshold) {
	// 	return;
	// }
	AI.prediction = {
		x : paddle.x,
		y : ball.y,
		dx : dx,
		dy : dy,
	}
}

function	predictBall(dx : number, dy : number) {
	//const ball = S.Objects['ball'];

	const { field: fieldSize , ball: ballSize, paddle: paddleSize} = S.gameScreenPixels;
	const { ball, lPlayer, rPlayer, score } = S.gamePos;

	const ballCopy = { x: ball.x, y: ball.y, vx: dx };

	//simulate ball movement to anticipate bounces
	while (ballCopy.x + ballSize.radius < rPlayer.x - paddle.width / 2) {
		ballCopy.x += dx;
		ballCopy.y += dy;
		if (ballCopy.y <= 0 || ballCopy.y >= field.height) {
			ballCopy.y = Math.max(0, Math.min(ballCopy.y, field.height));
			dy *= -1;
		}
		if (ballCopy.x <= 0) {
			
		}
	}
	
	//add error margin
	// let errorMargin = 0;
	// const errorOffset = Math.random() * field.height * errorMargin;
	// const sign = Math.random() < 0.5 ? -1 : 1;
	// const Offset = errorOffset * sign;

	//clamp y to stay within field
	const predictedY = ballCopy.y; //+ Offset;

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

export function aiAlgorithm() : boolean {

	const { ball, lPlayer, rPlayer, score} = S.gamePos;
	const paddle = S.gameScreenPixels.paddle;

	const paddleCenter = rPlayer.y + paddle.height / 2;

	if (Game.timeGame - AI.lastView > AI.reactionTime) {
		AI.lastView = Game.timeGame;
		predictAction()
	}

	console.log(`Prediction value-y: ${AI.prediction.y} -- Padle Y: ${lPlayer.y}`);
	if (AI.prediction.y > paddleCenter + paddle.height * 0.1) {
		movePadel('ArrowDown');
		return true;
	}
	else if (AI.prediction.y < paddleCenter - paddle.height * 0.1) {
		movePadel('ArrowUp');
		return true;
	}
	return false;
}
