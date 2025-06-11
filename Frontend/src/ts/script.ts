import { checkPadelMovement, updatePadelPosition, calculateBallDir, updateBallPosition } from './gameLogic.js'

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
}

export const Objects: {[key: string]: Item} = {
	"ball":	{angle: 0.33, speed: 10, x: 0, y: 0},
	"player1": {angle: 0, speed: 10, x: 0, y: 0},
	"player2": {angle: 0, speed: 10, x: 0, y: 0}
}


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
	

	if ('ballX' in data) {
		const ball = document.getElementById('ball');
		if (ball && typeof data.ballX === 'number')
			ball.style.left = `${data.ballX}px`
		if (ball && typeof data.ballY === 'number')
			ball.style.top = `${data.ballY}px`
	}
	if ('rPlayerX' in data)

//   const lPlayer = document.getElementById('lPlayer');
//   const rPlayer = document.getElementById('rPlayer');
//   if (lPlayer && rPlayer) {
// 	if (typeof data.lHeight === 'number') {
// 	  lPlayer.style.top = `${data.lHeight}px`;
// 	}
// 	if (typeof data.rHeight === 'number') {
// 	  rPlayer.style.top = `${data.rHeight}px`;
// 	}
// 	// log('Received from server: ' + JSON.stringify(data));
//   }
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

	Objects["ball"].y = parseInt(ball?.style.top || "0");
	Objects["ball"].x = parseInt(ball?.style.left || "0");
	Objects["player1"].y = parseInt(playerOne?.style.top || "0");
	Objects["player1"].x = parseInt(playerOne?.style.left || "0");
	Objects["player2"].y = parseInt(playerTwo?.style.top || "0");
	Objects["player2"].x = parseInt(playerTwo?.style.left || "0");
}

function gameLoop() {
	// checkWallCollision();
	// checkPaddelCollision();
	calculateBallDir();
	updateBallPosition();
	if (checkPadelMovement())
		updatePadelPosition();
	window.requestAnimationFrame(gameLoop);
}

initPositions();
window.requestAnimationFrame(gameLoop);


// window.addEventListener("keydown", (e: KeyboardEvent) => {
// 	if (socket.readyState === WebSocket.OPEN &&
// 		(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s")) {
// 		const lP = document.getElementById("lPlayer");
// 		const rP = document.getElementById("rPlayer");
// 		if (lP && rP) {
// 		const msg = { key: e.key, press: "keydown", lHeight: lP.offsetTop, rHeight: offsetTop};
// 		socket.send(JSON.stringify(msg));
// 		} else {
// 			console.log("No lP ot rP");
// 		}
//   }
// });