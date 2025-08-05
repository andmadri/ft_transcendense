import * as S from '../structs.js'
import { E } from '../structs.js'
import { Game } from '../script.js'
import { movePadel } from './gameLogic.js'

const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos} = S.pos;
const { field : fieldVelocity, ball: ballVelocity, lPlayer: lPlayerVelocity, rPlayer: rPlayerVelocity} = S.velocity;

export const AI: S.AIInfo = {
	prediction : { 
		x : rPlayerPos.x, 
		y : rPlayerPos.y, 
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

	const threshold = fieldSize.height * 0.5;
	
	if (Math.abs(ballPos.y - rPlayerPos.y) < threshold) {
		return;
	}
	AI.prediction = {
		x : rPlayerPos.x,
		y : ballPos.y,
		dx : dx,
		dy : dy,
	}
}

function	predictBall(dx : number, dy : number) {

	const ballPosCopy = { x: ballPos.x, y: ballPos.y};
	const ballRadius = ballSize.width / 2;

	//simulate ball movement to anticipate bounces
	while (ballPosCopy.x + ballRadius < rPlayerPos.x - rPlayerSize.width / 2) {
		ballPosCopy.x += dx;
		ballPosCopy.y += dy;
		if (ballPosCopy.y <= 0 || ballPosCopy.y >= fieldSize.height) {
			ballPosCopy.y = Math.max(0, Math.min(ballPosCopy.y, fieldSize.height));
			dy *= -1;
		}
	}
	
	//add error margin
	let errorMargin = 0.001;
	const errorOffset = Math.random() * fieldSize.height * errorMargin;
	const sign = Math.random() < 0.5 ? -1 : 1;
	const Offset = errorOffset * sign;
	const predictedY = ballPosCopy.y; + Offset;

	AI.prediction = {
		x : rPlayerPos.x,
		y : predictedY,
		dx : dx,
		dy : dy,
	}
}

function	predictAction() {
	const ball = S.movement[E.ball];

	//calculate dx and dy
	const dx = ballVelocity.vx * ball.speed;
	const dy = ballVelocity.vy * ball.speed;

	if (dx <= 0) {
		followBall(dx, dy);
		return;
	}
	else {
		predictBall(dx, dy);
	}
}

export function aiAlgorithm() : boolean {

	const paddleCenter = rPlayerPos.y + rPlayerSize.height / 2;

	if (Game.timeGame - AI.lastView > AI.reactionTime) {
		AI.lastView = Game.timeGame;
		predictAction()
	}
	if (AI.prediction.y > paddleCenter + rPlayerSize.height * 0.1) {
		movePadel('ArrowDown');
		return true;
	}
	else if (AI.prediction.y < paddleCenter - rPlayerSize.height * 0.1) {
		movePadel('ArrowUp');
		return true;
	}
	return false;
}
