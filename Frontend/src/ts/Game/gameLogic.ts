import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { OT, state } from '@shared/enums'
import { entity } from '@shared/types'
import { aiAlgorithm, resetAI } from './aiLogic.js'
import { sendBallUpdate, sendPaddleUpdate, sendScoreUpdate} from './gameStateSync.js'

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

function handlePaddleMovement(paddle: entity, dir: number) {
	const nextPos = paddle.pos.y + (dir * paddle.movement.speed);
	paddle.pos.y = Math.max(paddle.size.height / 2, Math.min(nextPos, field.size.height - paddle.size.height / 2));
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
	const halfHeight = ball.size.height / 2;
	const halfWidth = ball.size.width / 2;
	ball.pos.x += ball.velocity.vx;
	ball.pos.y += ball.velocity.vy;
	if (ball.pos.y - halfHeight < 0)
		ball.pos.y = halfHeight;
	//this line keeps the ball from going past the bottom
	else if (ball.pos.y + halfHeight > field.size.height)
		ball.pos.y = field.size.height - halfHeight;
	if (ball.pos.x - halfWidth < 0)
		ball.pos.x = halfWidth;
	else if (ball.pos.x + halfWidth > field.size.width)
		ball.pos.x = field.size.width - halfWidth;
}

export function randomizeBallAngle() {
	const minDeg = 0;
	const maxDeg = 45;
	const randomAngle = Math.random() * (maxDeg - minDeg) + minDeg;
	const radians = randomAngle * (Math.PI / 180);

	const vx = Math.cos(radians);
	const vy = Math.sin(radians) //* (1 / 0.75);

	const norm = Math.sqrt(vx * vx + vy * vy);

	const ux = vx / norm;
	const uy = vy / norm;

	ball.velocity.vx = ball.movement.speed * (Math.random() < 0.5 ? ux : -ux);
	ball.velocity.vy = ball.movement.speed * (Math.random() < 0.5 ? uy : -uy);

	console.log('RandomizeBallAngle Ball:', {
		ball: { vx: ball.velocity.vx, vy: ball.velocity.vy, speed: ball.movement.speed },
		});
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
	ball.pos.x = 0.5;
	ball.pos.y = 0.5;
	randomizeBallAngle();
	if (Game.match.mode == OT.ONEvsCOM) {
		resetAI();
	}
}

function changeVelocityOnPaddleBounce(player : entity) {
	const relativeHitPoint = ball.pos.y - player.pos.y;
	const normalizedHitPoint = relativeHitPoint / (player.size.height / 2);

	const maxBounceAngle = (Math.PI / 6)
	const angle = normalizedHitPoint * maxBounceAngle;

	const direction = ball.velocity.vx > 0 ? -1 : 1;

	const vx = Math.cos(angle) * direction;
	const vy = Math.sin(angle)

	const norm = Math.sqrt(vx * vx + vy * vy);

	const ux = vx / norm;
	const uy = vy / norm;

	ball.velocity.vx = ux * ball.movement.speed;
	ball.velocity.vy = uy * ball.movement.speed;
}

function handlePaddleBounce() {
	const halfWidth = ball.size.width / 2;
	const halfheight = ball.size.height / 2;

	if (ball.velocity.vx > 0 && ball.pos.x + halfWidth >= paddle2.pos.x)
	{
		if ((ball.pos.y - halfheight < paddle2.pos.y + paddle2.size.height / 2) && (ball.pos.y + halfheight > paddle2.pos.y - paddle2.size.height / 2))
		{
			changeVelocityOnPaddleBounce(paddle2);
			console.log('Field, Ball and Paddles:', {
				field: { width: field.size.width, height: field.size.height },
				ball: { x: ball.pos.x, y: ball.pos.y, width: ball.size.width, height: ball.size.height },
				paddle1: { x: paddle1.pos.x, y: paddle1.pos.y, width: paddle1.size.width, height: paddle1.size.height },
				paddle2: { x: paddle2.pos.x, y: paddle2.pos.y, width: paddle2.size.width, height: paddle2.size.height }
			});
		}
		else {
			pauseBallTemporarily(3000);
			Game.match.player1.score++;
			sendScoreUpdate(Game.match.player1.ID);
			resetBall();
		}
	}
	else if (ball.velocity.vx < 0 && ball.pos.x - halfWidth <= paddle1.pos.x + paddle1.size.width)
	{
		if ((ball.pos.y - halfheight < paddle1.pos.y + paddle1.size.height / 2) && (ball.pos.y + halfheight > paddle1.pos.y - paddle1.size.height / 2))
		{
			changeVelocityOnPaddleBounce(paddle1);
			console.log('Field, Ball and Paddles:', {
				field: { width: field.size.width, height: field.size.height },
				ball: { x: ball.pos.x, y: ball.pos.y, width: ball.size.width, height: ball.size.height },
				paddle1: { x: paddle1.pos.x, y: paddle1.pos.y, width: paddle1.size.width, height: paddle1.size.height },
				paddle2: { x: paddle2.pos.x, y: paddle2.pos.y, width: paddle2.size.width, height: paddle2.size.height }
			});
		}
		else {
			pauseBallTemporarily(3000);
			Game.match.player2.score++;
			sendScoreUpdate(Game.match.player2.ID);
			resetBall();
		}
	}
}

function updateDOMElements() {
	const halfHeight = ball.size.height / 2;
	const halfWidth = ball.size.width / 2;
	const paddle1Div = document.getElementById('lPlayer');
	const paddle2Div = document.getElementById('rPlayer');
	const ballDiv = document.getElementById('ball');
	const leftScore = document.getElementById('leftScore');
	const rightScore = document.getElementById('rightScore');
	const fieldDiv = document.getElementById('field');

	if (ballDiv && paddle1Div && paddle2Div && leftScore && rightScore && fieldDiv) {
		leftScore.textContent = Game.match.player1.score.toString();
		rightScore.textContent = Game.match.player2.score.toString();

		ballDiv.style.left = `${(ball.pos.x * fieldDiv.clientWidth)}px`;
		ballDiv.style.top = `${(ball.pos.y * fieldDiv.clientWidth)}px`;

		paddle1Div.style.top = `${(paddle1.pos.y * fieldDiv.clientWidth) - (paddle1.size.height * fieldDiv.clientWidth / 2)}px`;
		paddle2Div.style.top = `${(paddle2.pos.y * fieldDiv.clientWidth) - (paddle2.size.height * fieldDiv.clientWidth / 2)}px`;
	}
}

export function pauseBallTemporarily(duration: number) {
	const ballDiv = document.getElementById('ball');
	if (!ballDiv)
		return;
	Game.match.state = state.Paused;
	ballDiv.style.animation = 'twinkle 1s ease-in-out infinite';
	setTimeout(() => {
		Game.match.state = state.Playing;
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
			Game.match.state = state.End;
			return ;
		}
		handleWallBounce();
		handlePaddleBounce();
		if (Game.match.state == state.Playing) {
			updateBallPos();
			sendBallUpdate();
		}
		if (checkPaddleMovement())
			sendPaddleUpdate();
	}
	updateDOMElements();
}
