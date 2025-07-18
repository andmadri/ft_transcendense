import { Game } from '../script.js'
import { log } from '../logging.js'
import * as S from '../structs.js'
import { initPositions } from './initGame.js';
import { updateScoreMenu } from '../SideMenu/SideMenuContent.js';

export function processBallUpdate(data: any) {
	if ('ballX' in data) {
		const ball = document.getElementById('ball');
		if (ball && typeof data.ballX === 'number')
			ball.style.left = `${data.ballX}px`;
		if (ball && typeof data.ballY === 'number')
			ball.style.top = `${data.ballY}px`;
	}
}

export function processPadelUpdate(data: any) {
	if ('rPlayerX' in data) {
		const rPlayer = document.getElementById('rPlayer');
		if (rPlayer && typeof data.playerOneX === 'number')
			rPlayer.style.left = `${data.playerOneX}px`;
		if (rPlayer && typeof data.playerOneY === 'number')
			rPlayer.style.top = `${data.playerOneY}px`;
		S.Objects['rPlayer'].y = data.playerOneY;
		
	}
	if ('lPlayerX' in data) {
		const lPlayer = document.getElementById('lPlayer');
		if (lPlayer && typeof data.playerTwoX === 'number')
			lPlayer.style.left = `${data.playerTwoX}px`;
		if (lPlayer && typeof data.playerTwoY === 'number')
			lPlayer.style.top = `${data.playerTwoY}px`;
		S.Objects['lPlayer'].y = data.playerTwoY;
	}
}

function checkAndMovePadel(padel: string, movement: number) {
	const currentPadel = document.getElementById(padel);
	let top = parseInt(currentPadel?.style.top || '0');
	let newPosition = top + movement;
	if (currentPadel) {
		if (newPosition < 0)
			newPosition = 0;
		else if (newPosition > S.Objects['field'].height - currentPadel.clientHeight) 
			newPosition = S.Objects['field'].height - currentPadel.clientHeight;
		currentPadel.style.top = `${newPosition}px`;
		S.Objects[padel].y = newPosition;
	}
}

function movePadel(key: string) {
	if (key === 'w' || key === 's') {
		checkAndMovePadel('lPlayer', S.Keys[key].dir);
	} else if (key === 'ArrowUp' || key === 'ArrowDown') {
		checkAndMovePadel('rPlayer', S.Keys[key].dir);
	}
}

export function checkPadelMovement(): boolean {
	let moved = false;
	for (let key in S.Keys) {
		if (S.Keys[key].pressed === true) {
			movePadel(key);
			moved = true;
		}
	}
	return (moved);
}

export function updatePadelPosition() {
	const leftPadel = document.getElementById('lPlayer');
	const rightPadel = document.getElementById('rPlayer');
	if (Game.socket.readyState != WebSocket.OPEN)
		return ;
	if (leftPadel && rightPadel) {
		const msg = { 
			action: 'game',
			subaction: 'padelUpdate',
			lHeight: leftPadel.offsetTop,
			rHeight: rightPadel.offsetTop };
		Game.socket.send(JSON.stringify(msg));
	} else {
		console.log('No lP ot rP');
	}
}

export function calculateBallDir() {
	const ballSize = S.Objects['ball'].height / 2;
	S.Objects['ball'].y += Math.sin(S.Objects['ball'].angle) * S.Objects['ball'].speed;
	S.Objects['ball'].x += Math.cos(S.Objects['ball'].angle) * S.Objects['ball'].speed;
	if (S.Objects['ball'].y - ballSize < 0)
		S.Objects['ball'].y = ballSize;
	else if (S.Objects['ball'].y + ballSize > S.Objects['field'].height)
		S.Objects['ball'].y = S.Objects['field'].height - ballSize;
	if (S.Objects['ball'].x - ballSize < 0)
		S.Objects['ball'].x = ballSize;
	else if (S.Objects['ball'].x + ballSize > S.Objects['field'].width)
		S.Objects['ball'].x = S.Objects['field'].width - ballSize;
}

export function updateBallPosition() {
	const msg = { 
		action: 'game',
		subaction: 'ballUpdate',
		ballY: S.Objects['ball'].y,
		ballX: S.Objects['ball'].x};
	Game.socket.send(JSON.stringify(msg));
}

function normalizeAngle(angle: number) {
    const twoPi = 2 * Math.PI;
    return (angle % twoPi + twoPi) % twoPi;
}

export function checkWallCollision() {
	const radius = S.Objects['ball'].height / 2;
	if (S.Objects['ball'].y <= radius || S.Objects['ball'].y + radius >= S.Objects['field'].height)
		S.Objects['ball'].angle = normalizeAngle(-S.Objects['ball'].angle);
	
}

function resetBall()
{
	const field = document.getElementById("field");
	const ball = document.getElementById("ball");
	const ballSize = S.Objects["field"].width * 0.05;

	if (ball && field)
	{
		S.Objects["ball"].x = field.clientWidth / 2;
		S.Objects["ball"].y = field.clientHeight / 2;
		ball.style.left = `${S.Objects["ball"].x - ballSize / 2}px`;
		ball.style.top = `${S.Objects["ball"].y - ballSize / 2}px`;
	}
}

export function checkPaddelCollision() {
	const ball = S.Objects['ball'];
	const radius = ball.width / 2;
	const rightPadel = S.Objects['rPlayer'];
	const leftPadel = S.Objects['lPlayer'];

	if (ball.x + radius >= rightPadel.x)
	{
		if (ball.y + radius >= rightPadel.y && ball.y - radius <= rightPadel.y + rightPadel.height)
		{
			ball.angle = normalizeAngle(Math.PI - ball.angle);
			return ;
		}
		else
		{
			// MISS
			Game.score++;			
			updateScoreMenu();
			resetBall();
		}
	}
	else if (ball.x - radius <= leftPadel.x + leftPadel.width)
	{
		if (ball.y - radius >= leftPadel.y && ball.y + radius <= leftPadel.y + leftPadel.height)
		{
			ball.angle = normalizeAngle(Math.PI - ball.angle);
			return ;
		}
		else
		{
			// MISS
			Game.score2++;
			updateScoreMenu();
			resetBall();
		}
	}
}

export function game() {
	checkWallCollision();
	checkPaddelCollision();
	calculateBallDir();
	updateBallPosition();
	if (checkPadelMovement())
		updatePadelPosition();	
}

export function actionGame(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'ballUpdate':
 			processBallUpdate(data);
			break ;
		case 'padelUpdate':
			processPadelUpdate(data);
			break ;
		default:
			log(`(actionGame) Unknown action: ${data.subaction}`);
	}
}