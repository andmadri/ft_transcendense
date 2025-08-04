import { Game } from '../script.js'
import * as S from '../structs.js'
import { aiAlgorithm, resetAI } from './aiLogic.js'
import { sendBallUpdate, sendPaddleUpdate } from './gameStateSync.js'
import { handleGameOver } from './gameContent.js'

const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos } = S.pos;
const { field : fieldMove, ball: ballMove, lPlayer: lPlayerMove, rPlayer: rPlayerMove } = S.movement;

function handlePaddleMovement(player: S.E, element : string, dir: number) {
	const nextPos = S.pos[player].y + (dir * S.movement[player].speed);
	S.pos[player].y = Math.max(0, Math.min(nextPos, fieldSize.height - S.size[player].height));
}

export function movePadel(key: string) {
	if (key === 'w' || key === 's') {
		handlePaddleMovement(S.E.lPlayer, 'lPlayer', S.Keys[key].dir);
		
	} else if (key === 'ArrowUp' || key === 'ArrowDown') {
		handlePaddleMovement(S.E.rPlayer, 'rPlayer', S.Keys[key].dir);
	}
}

export function checkPaddleMovement(): boolean {
	let moved = false;
	if (Game.opponentType == S.OT.ONEvsCOM) {
		moved = aiAlgorithm();
	}
	for (let key in S.Keys) {
		if (S.Keys[key].pressed === true) {
			movePadel(key);
			moved = true;
		}
	}
	return (moved);
}

export function updateBallPos() {
	const ballRadius = ballSize.height / 2;
	ballPos.y += Math.sin(ballMove.angle) * ballMove.speed;
	ballPos.x += Math.cos(ballMove.angle) * ballMove.speed;
	if (ballPos.y - ballRadius < 0)
		ballPos.y = ballRadius;
	//this line keeps the ball from going past the bottom
	else if (ballPos.y + ballRadius > fieldSize.height)
		ballPos.y = fieldSize.height - ballRadius;
	if (ballPos.x - ballRadius < 0)
		ballPos.x = ballRadius;
	else if (ballPos.x + ballRadius > fieldSize.width)
		ballPos.x = fieldSize.width - ballRadius;
}


function normalizeAngle(angle: number) {
    const twoPi = 2 * Math.PI;
    return (angle % twoPi + twoPi) % twoPi;
}

export function handleWallBounce() {
	const radius = ballSize.height / 2;
	if (ballPos.y <= radius || ballPos.y + radius >= fieldSize.height)
		ballMove.angle = normalizeAngle(-ballMove.angle);
}

//change direction of the ball on each reset
function resetBall(){
	ballPos.x = fieldSize.width / 2;
	ballPos.y = fieldSize.height / 2;
	ballMove.angle = normalizeAngle(Math.PI - ballMove.angle);
	if (Game.opponentType == S.OT.ONEvsCOM) {
		resetAI();
	}
}

export function handlePaddleBounce() {
	const radius = ballSize.width / 2;

	if (ballPos.x + radius >= rPlayerPos.x)
	{
		if ((ballPos.y - radius < rPlayerPos.y + rPlayerSize.height) && (ballPos.y + radius > rPlayerPos.y))
		{
			ballMove.angle = normalizeAngle(Math.PI - ballMove.angle);
			return ;
		}
		else {
			Game.scoreLeft++;
			resetBall();
		}
	}
	else if (ballPos.x - radius <= lPlayerPos.x + lPlayerSize.width)
	{
		if ((ballPos.y - radius < lPlayerPos.y + lPlayerSize.height) && (ballPos.y + radius > lPlayerPos.y))
		{
			ballMove.angle = normalizeAngle(Math.PI - ballMove.angle);
			return ;
		}
		else {
			Game.scoreRight++;
			resetBall();
		}
	}
}

function updateDOMElements() {
	const lPlayer = document.getElementById('lPlayer');
	const rPlayer = document.getElementById('rPlayer');
	const ball = document.getElementById('ball');
	const leftScore = document.getElementById('leftScore');
	const rightScore = document.getElementById('rightScore');
	const ballRadius = ballSize.height / 2;

	if (ball && lPlayer && rPlayer && leftScore && rightScore) {
		leftScore.textContent = Game.scoreLeft.toString();
		rightScore.textContent = Game.scoreRight.toString();
		ball.style.left = `${ballPos.x - ballRadius}px`;
		ball.style.top = `${ballPos.y - ballRadius}px`;

		lPlayer.style.top = `${lPlayerPos.y}px`;
		rPlayer.style.top = `${rPlayerPos.y}px`;
	}
}

export function game() {
	Game.timeGame = performance.now();
	if (Game.scoreRight == 5 || Game.scoreLeft == 5) {
		Game.state = S.State.Menu;
		handleGameOver();
		return ;
	}
	handleWallBounce();
	handlePaddleBounce();
	updateBallPos();
	sendBallUpdate();
	if (checkPaddleMovement())
		sendPaddleUpdate();
	updateDOMElements();
}
