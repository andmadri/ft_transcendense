import { Game } from '../script.js'
import * as S from '../structs.js'
import { OT } from '@shared/enums'
import { aiAlgorithm, resetAI } from './aiLogic.js'
import { sendBallUpdate, sendPaddleUpdate, sendScoreUpdate} from './gameStateSync.js'

const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos } = S.pos;
const { field : fieldMove, ball: ballMove, lPlayer: lPlayerMove, rPlayer: rPlayerMove } = S.movement;
const { field : fieldVelocity, ball: ballVelocity, lPlayer: lPlayerVelocity, rPlayer: rPlayerVelocity } = S.velocity;

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

function checkPaddleMovement(): boolean {
	let moved = false;
	if (Game.opponentType == OT.ONEvsCOM) {
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
	ballPos.x += ballVelocity.vx * ballMove.speed;
	ballPos.y += ballVelocity.vy * ballMove.speed;
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

export function randomizeBallAngle() {
	const minDeg = 0;
	const maxDeg = 45;
	const randomAngle = Math.random() * (maxDeg - minDeg) + minDeg;
	const radians = randomAngle * (Math.PI / 180);

	const vx = Math.cos(radians);
	const vy = Math.sin(radians);

	ballVelocity.vx = Math.random() < 0.5 ? vx : vx * -1;
	ballVelocity.vy = Math.random() < 0.5 ? vy : vy * -1;
}


function normalizeAngle(angle: number) {
    const twoPi = 2 * Math.PI;
    return (angle % twoPi + twoPi) % twoPi;
}

function handleWallBounce() {
	const radius = ballSize.height / 2;
	if (ballPos.y <= radius || ballPos.y + radius >= fieldSize.height)
		ballVelocity.vy *= -1;
}

//change direction of the ball on each reset
function resetBall(){
	const ballRadius = ballSize.width / 2;
	ballPos.x = fieldSize.width / 2 + ballRadius;
	ballPos.y = fieldSize.height / 2 + ballRadius;
	randomizeBallAngle();
	if (Game.opponentType == OT.ONEvsCOM) {
		resetAI();
	}
}

function changeVelocityOnPaddleBounce(PlayerPos : S.Pos, playerSize : S.Size) {
	const relativeHitPoint = (ballPos.y - PlayerPos.y) - playerSize.height / 2;
	const normalizedHitPoint = relativeHitPoint / (playerSize.height / 2);

	const maxBounceAngle = (Math.PI / 4) //45 degrees max
	const angle = normalizedHitPoint * maxBounceAngle;

	const direction = ballVelocity.vx > 0 ? -1 : 1;

	ballVelocity.vx = Math.cos(angle) * direction;
	ballVelocity.vy = Math.sin(angle);
}

function handlePaddleBounce() {
	const radius = ballSize.width / 2;

	if (ballPos.x + radius >= rPlayerPos.x)
	{
		if ((ballPos.y - radius < rPlayerPos.y + rPlayerSize.height) && (ballPos.y + radius > rPlayerPos.y))
		{
			changeVelocityOnPaddleBounce(rPlayerPos, rPlayerSize);
		}
		else {
			Game.scoreLeft++;
			sendScoreUpdate(Game.player1Id);
			resetBall();
			pauseBallTemporarily(3000);
		}
	}
	else if (ballPos.x - radius <= lPlayerPos.x + lPlayerSize.width)
	{
		if ((ballPos.y - radius < lPlayerPos.y + lPlayerSize.height) && (ballPos.y + radius > lPlayerPos.y))
		{
			changeVelocityOnPaddleBounce(lPlayerPos, lPlayerSize);
		}
		else {
			Game.scoreRight++;
			sendScoreUpdate(Game.player2Id);
			resetBall();
			pauseBallTemporarily(3000);
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
		ball.style.left = `${ballPos.x}px`;
		ball.style.top = `${ballPos.y}px`;

		lPlayer.style.top = `${lPlayerPos.y}px`;
		rPlayer.style.top = `${rPlayerPos.y}px`;
	}
}

export function pauseBallTemporarily(duration: number) {
	const ball = document.getElementById('ball');
	if (!ball)
		return;
	Game.ballPaused = true;
	ball.style.animation = 'twinkle 1s ease-in-out infinite';
	setTimeout(() => {
		Game.ballPaused = false;
		ball.style.animation = 'none';
	}, duration);
}

export function game() {
	if (Game.opponentType == OT.Online) {
		//update own paddle immediately in frontend
		checkPaddleMovement();
		updateDOMElements();
	}
	else {
		Game.timeGame = performance.now();
		if (Game.scoreRight == 5 || Game.scoreLeft == 5) {
			Game.state = S.State.End;
			return ;
		}
		handleWallBounce();
		handlePaddleBounce();
		if (!Game.ballPaused) {
			updateBallPos();
			sendBallUpdate();
		}
		if (checkPaddleMovement())
			sendPaddleUpdate();
	}
	updateDOMElements();
}
