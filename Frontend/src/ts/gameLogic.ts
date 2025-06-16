import { controller, Objects, socket, Field } from './script.js'

function checkAndMovePadel(padel: string, movement: number) {
	const currentPadel = document.getElementById(padel);
	let top = parseInt(currentPadel?.style.top || "0");
	let newPosition = top + movement;
	if (currentPadel) {
		if (newPosition < 0)
			newPosition = 0;
		else if (newPosition > Field.height - currentPadel.clientHeight) 
			newPosition = Field.height - currentPadel.clientHeight;
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
	else if (Objects["ball"].y + Objects["ball"].height > Field.height)
		Objects["ball"].y = Field.height - Objects["ball"].height;
	if (Objects["ball"].x < 0)
		Objects["ball"].x = 0;
	else if (Objects["ball"].x + Objects["ball"].width > Field.width)
		Objects["ball"].x = Field.width - Objects["ball"].width;
}

export function updateBallPosition() {
	const msg = { "ballY": Objects["ball"].y, ballX: Objects["ball"].x};
	socket.send(JSON.stringify(msg));
}

function normalizeAngle(angle: number) {
    const twoPi = 2 * Math.PI;
    return (angle % twoPi + twoPi) % twoPi;
}

export function checkWallCollision() {
	if (Objects["ball"].y <= 0 || Objects["ball"].y + Objects["ball"].height >= Field.height)
		Objects["ball"].angle = normalizeAngle(-Objects["ball"].angle);
	
}

export function checkPaddelCollision() {
	if (Objects["ball"].x <= 0 || Objects["ball"].x + Objects["ball"].width >= Field.width)
		Objects["ball"].angle = normalizeAngle(Math.PI - Objects["ball"].angle);	
}
