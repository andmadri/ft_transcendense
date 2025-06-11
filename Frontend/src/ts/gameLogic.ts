import { controller, Objects, socket } from './script.js'

function checkAndMovePadel(padel: string, movement: number) {
	const currentPadel = document.getElementById(padel);
	let top = parseInt(currentPadel?.style.top || "0");
	let newPosition = top + movement;
	if (currentPadel) {
		if (newPosition < 0)
			newPosition = 0;
		else if (newPosition > 600) 
			newPosition = 600;
		currentPadel.style.top = `${newPosition}px`;
	}
}

function movePadel(key: string) {
	if (key === "w" || key === "s") {
		checkAndMovePadel("lPlayer", controller[key].dir);
	} else if (key === "ArrowUp" || key === "ArrowDown") {
		checkAndMovePadel("rPlayer", controller[key].dir);
	}
}

export function checkPadelMovement(): boolean {
	let moved = false;
	for (let key in controller) {
		if (controller[key].pressed === true) {
			movePadel(key);
			moved = true;
		}
	}
	return (moved);
}

export function updatePadelPosition() {
	const leftPadel = document.getElementById("rPlayer");
	const rightPadel = document.getElementById("lPlayer");
	if (socket.readyState != WebSocket.OPEN)
		return ;
	if (leftPadel && rightPadel) {
		const msg = { lHeight: leftPadel.offsetTop, rHeight: rightPadel.offsetTop };
		socket.send(JSON.stringify(msg));
	} else {
		console.log("No lP ot rP");
	}
}

export function calculateBallDir() {
	Objects["ball"].y += Math.sin(Objects["ball"].angle) * Objects["ball"].speed;
	Objects["ball"].x += Math.cos(Objects["ball"].angle) * Objects["ball"].speed;
	if (Objects["ball"].y < 0)
		Objects["ball"].y = 0;
	else if (Objects["ball"].y > 600)
		Objects["ball"].y = 600;
	if (Objects["ball"].x < 0)
		Objects["ball"].x = 0;
	else if (Objects["ball"].x > 600)
		Objects["ball"].x = 600;
}

export function updateBallPosition() {
	if (socket.readyState != WebSocket.OPEN)
		return ;
	const msg = { "ballY": Objects["ball"].y, ballX: Objects["ball"].x};
	socket.send(JSON.stringify(msg));
}



// function drawBall() {
// 	const ball = document.getElementById("ball");
	
// }