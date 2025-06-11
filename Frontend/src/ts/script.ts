import * as GameLogic from './gameLogic.js'

type keyHandler = {
	pressed: boolean;
	dir: number;
}

export const controller: {[key: string]: keyHandler} = {
	"ArrowUp": 		{pressed: false, dir: -10},
	"ArrowDown": 	{pressed: false, dir: 10},
	"w": 			{pressed: false, dir: -10},
	"s": 			{pressed: false, dir: 10}
};

type Item = {
	angle: number;
	speed: number;
	x: number;
	y: number;
	width: number;
	height: number;
}

export const Objects: {[key: string]: Item} = {
	"ball":	{angle: 0.33, speed: 10, x: 0, y: 0, width: 0, height: 0},
	"player1": {angle: 0, speed: 10, x: 0, y: 0, width: 0, height: 0},
	"player2": {angle: 0, speed: 10, x: 0, y: 0, width: 0, height: 0}
}

type FieldValues = {
	width: number;
	height: number;
	color: string;
}

export const Field: FieldValues = {
	width: 0,
	height: 0,
	color: "black",
};


// gets element from html file
const logDiv = document.getElementById('log') as HTMLDivElement;
// const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;
// create a websocket
export const socket = new WebSocket('ws://localhost:8080/ws');
// event listener when a websocket opens
socket.addEventListener('open', () => {
  log('✅ WebSocket is open');
});
// event listener for errors
socket.addEventListener('error', (err) => {
  log('⚠️ WebSocket error: ' + err);
});
// event listener that gets the meesage, put it in json format
socket.addEventListener('message', (event) => {
	const data = JSON.parse(event.data);
	// log('Received from server: ' + JSON.stringify(data));

	if ('ballX' in data) {
		const ball = document.getElementById('ball');
		if (ball && typeof data.ballX === 'number')
			ball.style.left = `${data.ballX}px`;
		if (ball && typeof data.ballY === 'number')
			ball.style.top = `${data.ballY}px`;
	}
	if ('rPlayerX' in data) {
		const rPlayer = document.getElementById('player1');
		if (rPlayer && typeof data.playerOneX === 'number')
			rPlayer.style.left = `${data.playerOneX}px`;
		if (rPlayer && typeof data.playerOneY === 'number')
			rPlayer.style.top = `${data.playerOneY}px`;
	}
	if ('lPlayerX' in data) {
		const lPlayer = document.getElementById('player2');
		if (lPlayer && typeof data.playerTwoX === 'number')
			lPlayer.style.left = `${data.playerTwoX}px`;
		if (lPlayer && typeof data.playerTwoY === 'number')
			lPlayer.style.top = `${data.playerTwoY}px`;		
	}
});
// eventlistener when de websocket closes
socket.addEventListener('close', event => {
  console.log('WebSocket closes:', event.code, event.reason);
});

// print msg in element 
function log(msg: string) {
  const p = document.createElement('p');
  p.textContent = msg;
  logDiv.appendChild(p);
  console.log(msg);
}

window.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s") {
		controller[e.key].pressed = true;
	}
});

window.addEventListener("keyup", (e: KeyboardEvent) => {
	if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s") {
		controller[e.key].pressed = false;
	}
});

// Get start position of ball
function initPositions() {
	const ball = document.getElementById("ball");
	const playerOne = document.getElementById("rPlayer");
	const playerTwo = document.getElementById("lPlayer");
	const field = document.getElementById("field");

	if (ball && playerOne && playerTwo && field)
	{
		Field.height = field.clientHeight - playerOne.clientHeight;
		Field.width = field.clientWidth;
		Objects["ball"].height = ball.clientHeight;
		Objects["ball"].width = ball.clientWidth;
		Objects["ball"].x = (field.clientWidth / 2) - (Objects["ball"].width / 2);
		Objects["ball"].y = (field.clientHeight / 2) - (Objects["ball"].height / 2);
		Objects["player1"].y = parseInt(playerOne.style.top);
		Objects["player1"].x = parseInt(playerOne.style.left);
		Objects["player2"].y = parseInt(playerTwo.style.top);
		Objects["player2"].x = parseInt(playerTwo.style.left);
		Objects["player1"].height = playerOne.clientHeight;
		Objects["player1"].width = playerOne.clientWidth;

	} else {
		console.log("Something went wrong, close game?");
	}
}

function gameLoop() {
	if (socket.readyState == WebSocket.OPEN)
	{
		GameLogic.checkWallCollision();
		GameLogic.checkPaddelCollision();
		GameLogic.calculateBallDir();
		GameLogic.updateBallPosition();
		if (GameLogic.checkPadelMovement())
			GameLogic.updatePadelPosition();
	}
	window.requestAnimationFrame(gameLoop);
}

initPositions();
window.requestAnimationFrame(gameLoop);
