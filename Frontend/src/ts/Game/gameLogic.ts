import { Game } from '../script.js'
import { log } from '../logging.js'
import * as S from '../structs.js'
import { initPositions } from './initGame.js';
import { updateScoreMenu } from '../SideMenu/SideMenuContent.js';
import { aiAlgorithm, resetAI } from './aiLogic.js';
import { trainingSet, downloadTrainingData, collectTrainingData } from './aiTraining.js'

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
	const fieldH = S.Objects['field'].height;
	const currentPadel = document.getElementById(padel);
	if (!currentPadel)
		return ;
	let top = currentPadel.offsetTop;
	const paddleH = currentPadel.clientHeight;
	const nextPos = top + (movement * S.Objects[padel].speed);
	const newPosition = Math.max(0, Math.min(nextPos, fieldH - paddleH));
	currentPadel.style.top = `${newPosition}px`;
	S.Objects[padel].y = newPosition;
}

export function movePadel(key: string) {
	if (key === 'w' || key === 's') {
		checkAndMovePadel('lPlayer', S.Keys[key].dir);
	} else if (key === 'ArrowUp' || key === 'ArrowDown') {
		checkAndMovePadel('rPlayer', S.Keys[key].dir);
	}
}

export function checkPadelMovement(): boolean {
	let moved = false;
	if (Game.opponentType == S.OT.ONEvsCOM) {
		aiAlgorithm();
	}
	for (let key in S.Keys) {
		if (Game.opponentType == S.OT.ONEvsCOM && (key == 'ArrowUp' || key == 'ArrowDown')) {
			continue;
		}
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
			rHeight: rightPadel.offsetTop,
			matchID: Game.matchID };
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
	//this line keeps the ball from going past the bottom
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
		ballX: S.Objects['ball'].x,
		matchID: Game.matchID
	};
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

function resetBall(){
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
	if (Game.opponentType == S.OT.ONEvsCOM) {
		resetAI();
	}
}

export function updateScoreDisplay(side: string, newScore: number) {
	const scoreSide = document.getElementById(side);
	if (scoreSide) {
		scoreSide.textContent = newScore.toString();
	}
	resetBall();
}

function updateScoreServer(id: number) {
	const msg = { 
		action: 'game',
		subaction: 'scoreUpdate',
		player: 0,
		matchID: Game.matchID
	};

	msg.player = id;
	Game.socket.send(JSON.stringify(msg));	
}

export function checkPaddelCollision() {
	const ball = S.Objects['ball'];
	const radius = ball.width / 2;
	const rightPadel = S.Objects['rPlayer'];
	const leftPadel = S.Objects['lPlayer'];

	if (ball.x + radius >= rightPadel.x)
	{
		if ((ball.y - radius < rightPadel.y + rightPadel.height) && (ball.y + radius > rightPadel.y))
		{
			ball.angle = normalizeAngle(Math.PI - ball.angle);
			return ;
		}
		else {
			updateScoreDisplay('leftScore', ++Game.scoreLeft);
			updateScoreServer(Game.id);
		}
	}
	else if (ball.x - radius <= leftPadel.x + leftPadel.width)
	{
		if ((ball.y - radius < leftPadel.y + leftPadel.height) && (ball.y + radius > leftPadel.y))
		{
			ball.angle = normalizeAngle(Math.PI - ball.angle);
			return ;
		}
		else {
			updateScoreDisplay('rightScore', ++Game.scoreRight);
			updateScoreServer(Game.id2);
		}
	}
}

export function handleGameOver() {
	Game.state = S.State.End;
	log("Game Over!");
	if (document.getElementById('gameOver')) {
		const gameOver = document.createElement('div');
		gameOver.id = 'gameOver';
		gameOver.style.position = 'absolute';
		gameOver.style.top = '50%';
		gameOver.style.left = '50%';
		gameOver.style.padding = '20px';
		gameOver.style.backgroundColor = 'black';
		gameOver.style.color = 'white';
		gameOver.style.fontSize = '2rem';
		gameOver.style.textAlign = 'center';
		gameOver.style.borderRadius = '10px';
		gameOver.innerHTML = `
		<p>Game Over!</p>
		<p>${Game.scoreLeft > Game.scoreRight ? "Left Player Wins!" : "Right Player Wins!"}</p>
		`;

		const app = document.getElementById('app');
		app?.appendChild(gameOver);
	}
}

export function game() {
	const AI = Game.opponentType == S.OT.ONEvsCOM ? true : false;
	if (AI) {
		Game.timeGame = performance.now();
		if (Game.scoreRight == 5 || Game.scoreLeft == 5) {
			handleGameOver();
			downloadTrainingData();
			trainingSet.length = 0;
			return ;
		}
	}
	checkWallCollision();
	checkPaddelCollision();
	calculateBallDir();
	updateBallPosition();
	if (checkPadelMovement())
		updatePadelPosition();
	if (AI) {
		const data = collectTrainingData();
		if (data != null) {
			trainingSet.push(data);
		}
	}
}
