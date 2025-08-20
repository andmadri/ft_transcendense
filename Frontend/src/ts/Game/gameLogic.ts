import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { OT, Stage } from '@shared/enums'
import { entity } from '@shared/types'
import { aiAlgorithm, resetAI } from './aiLogic.js'
import { sendBallUpdate, sendPaddleUpdate, sendScoreUpdate} from './gameStateSync.js'

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

function handlePaddleMovement(paddle: entity, dir: number) {
	const nextPos = paddle.pos.y + (dir * paddle.movement.speed);
	paddle.pos.y = Math.max(0, Math.min(nextPos, field.size.height - paddle.size.height));
}

export function movePadel(key: string) {
	if (key === 'w' || key === 's') {
		handlePaddleMovement(paddle1, S.Keys[key].dir);
		
	} else if (key === 'ArrowUp' || key === 'ArrowDown') {
		handlePaddleMovement(paddle2, S.Keys[key].dir);
	}
}

function checkPaddleMovement(): boolean {
	let moved = false;
	if (Game.match.mode == OT.ONEvsCOM) {
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
	const ballRadius = ball.size.height / 2;
	ball.pos.x += ball.velocity.vx * ball.movement.speed;
	ball.pos.y += ball.velocity.vy * ball.movement.speed;
	if (ball.pos.y - ballRadius < 0)
		ball.pos.y = ballRadius;
	//this line keeps the ball from going past the bottom
	else if (ball.pos.y + ballRadius > field.size.height)
		ball.pos.y = field.size.height - ballRadius;
	if (ball.pos.x - ballRadius < 0)
		ball.pos.x = ballRadius;
	else if (ball.pos.x + ballRadius > field.size.width)
		ball.pos.x = field.size.width - ballRadius;
}

export function randomizeBallAngle() {
	const minDeg = 0;
	const maxDeg = 45;
	const randomAngle = Math.random() * (maxDeg - minDeg) + minDeg;
	const radians = randomAngle * (Math.PI / 180);

	const vx = Math.cos(radians);
	const vy = Math.sin(radians);

	ball.velocity.vx = Math.random() < 0.5 ? vx : vx * -1;
	ball.velocity.vy = Math.random() < 0.5 ? vy : vy * -1;
}


function normalizeAngle(angle: number) {
    const twoPi = 2 * Math.PI;
    return (angle % twoPi + twoPi) % twoPi;
}

function handleWallBounce() {
	const radius = ball.size.height / 2;
	if (ball.pos.y <= radius || ball.pos.y + radius >= field.size.height)
		ball.velocity.vy *= -1;
}

//change direction of the ball on each reset
function resetBall(){
	const ballRadius = ball.size.width / 2;
	ball.pos.x = field.size.width / 2 + ballRadius;
	ball.pos.y = field.size.height / 2 + ballRadius;
	randomizeBallAngle();
	if (Game.match.mode == OT.ONEvsCOM) {
		resetAI();
	}
}

function changeVelocityOnPaddleBounce(player : entity) {
	const relativeHitPoint = (ball.pos.y - player.pos.y) - player.size.height / 2;
	const normalizedHitPoint = relativeHitPoint / (player.size.height / 2);

	const maxBounceAngle = (Math.PI / 4) //45 degrees max
	const angle = normalizedHitPoint * maxBounceAngle;

	const direction = ball.velocity.vx > 0 ? -1 : 1;

	ball.velocity.vx = Math.cos(angle) * direction;
	ball.velocity.vy = Math.sin(angle);
}

function handlePaddleBounce() {
	const radius = ball.size.width / 2;

	if (ball.pos.x + radius >= paddle2.pos.x)
	{
		if ((ball.pos.y - radius < paddle2.pos.y + paddle2.size.height) && (ball.pos.y + radius > paddle2.pos.y))
		{
			changeVelocityOnPaddleBounce(paddle2);
		}
		else {
			Game.match.player1.score++;
			sendScoreUpdate(Game.match.player1.ID);
			resetBall();
			pauseBallTemporarily(3000);
		}
	}
	else if (ball.pos.x - radius <= paddle1.pos.x + paddle1.size.width)
	{
		if ((ball.pos.y - radius < paddle1.pos.y + paddle1.size.height) && (ball.pos.y + radius > paddle1.pos.y))
		{
			changeVelocityOnPaddleBounce(paddle1);
		}
		else {
			Game.match.player2.score++;
			sendScoreUpdate(Game.match.player2.ID);
			resetBall();
			pauseBallTemporarily(3000);
		}
	}
}

function updateDOMElements() {
	const ballRadius = ball.size.height / 2;
	const paddle1Div = document.getElementById('lPlayer');
	const paddle2Div = document.getElementById('rPlayer');
	const ballDiv = document.getElementById('ball');
	const leftScore = document.getElementById('leftScore');
	const rightScore = document.getElementById('rightScore');

	if (ballDiv && paddle1Div && paddle2Div && leftScore && rightScore) {
		leftScore.textContent = Game.match.player1.score.toString();
		rightScore.textContent = Game.match.player2.score.toString();
		ballDiv.style.left = `${ball.pos.x}px`;
		ballDiv.style.top = `${ball.pos.y}px`;

		paddle1Div.style.top = `${paddle1.pos.y}px`;
		paddle2Div.style.top = `${paddle2.pos.y}px`;
	}
}

export function pauseBallTemporarily(duration: number) {
	const ballDiv = document.getElementById('ball');
	if (!ballDiv)
		return;
	UI.ballPaused = true;
	ballDiv.style.animation = 'twinkle 1s ease-in-out infinite';
	setTimeout(() => {
		UI.ballPaused = false;
		ballDiv.style.animation = 'none';
	}, duration);
}

export function game() {
	if (Game.match.mode == OT.Online) {
		//update own paddle immediately in frontend
		checkPaddleMovement();
		updateDOMElements();
	}
	else {
		Game.match.time = performance.now();
		if (Game.match.player1.score == 5 || Game.match.player2.score == 5) {
			UI.state = S.stateUI.Menu;
			return ;
		}
		handleWallBounce();
		handlePaddleBounce();
		if (!UI.ballPaused) {
			updateBallPos();
			sendBallUpdate();
		}
		if (checkPaddleMovement())
			sendPaddleUpdate();
	}
	updateDOMElements();
}
