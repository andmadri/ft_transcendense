import { Game } from './script.js'
import * as S from './structs.js'

function checkAndMovePadel(padel: string, movement: number) {
	const currentPadel = document.getElementById(padel);
	let top = parseInt(currentPadel?.style.top || "0");
	let newPosition = top + movement;
	if (currentPadel) {
		if (newPosition < 0)
			newPosition = 0;
		else if (newPosition > S.Objects['field'].height - currentPadel.clientHeight) 
			newPosition = S.Objects['field'].height - currentPadel.clientHeight;
		currentPadel.style.top = `${newPosition}px`;
	}
}

function movePadel(key: string) {
	if (key === "w" || key === "s") {
		checkAndMovePadel("lPlayer", S.Keys[key].dir);
	} else if (key === "ArrowUp" || key === "ArrowDown") {
		checkAndMovePadel("rPlayer", S.Keys[key].dir);
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
	const leftPadel = document.getElementById("rPlayer");
	const rightPadel = document.getElementById("lPlayer");
	if (Game.socket.readyState != WebSocket.OPEN)
		return ;
	if (leftPadel && rightPadel) {
		const msg = { 
			action: "padelUpdate",
			lHeight: leftPadel.offsetTop,
			rHeight: rightPadel.offsetTop };
		Game.socket.send(JSON.stringify(msg));
	} else {
		console.log("No lP ot rP");
	}
}

export function calculateBallDir() {
	S.Objects["ball"].y += Math.sin(S.Objects["ball"].angle) * S.Objects["ball"].speed;
	S.Objects["ball"].x += Math.cos(S.Objects["ball"].angle) * S.Objects["ball"].speed;
	if (S.Objects["ball"].y < 0)
		S.Objects["ball"].y = 0;
	else if (S.Objects["ball"].y + S.Objects["ball"].height > S.Objects['field'].height)
		S.Objects["ball"].y = S.Objects['field'].height - S.Objects["ball"].height;
	if (S.Objects["ball"].x < 0)
		S.Objects["ball"].x = 0;
	else if (S.Objects["ball"].x + S.Objects["ball"].width > S.Objects['field'].width)
		S.Objects["ball"].x = S.Objects['field'].width - S.Objects["ball"].width;
}

export function updateBallPosition() {
	const msg = { 
		action: "ballUpdate",
		ballY: S.Objects["ball"].y,
		ballX: S.Objects["ball"].x};
	Game.socket.send(JSON.stringify(msg));
}

function normalizeAngle(angle: number) {
    const twoPi = 2 * Math.PI;
    return (angle % twoPi + twoPi) % twoPi;
}

export function checkWallCollision() {
	if (S.Objects["ball"].y <= 0 || S.Objects["ball"].y + S.Objects["ball"].height >= S.Objects['field'].height)
		S.Objects["ball"].angle = normalizeAngle(-S.Objects["ball"].angle);
	
}

export function checkPaddelCollision() {
	if (S.Objects["ball"].x <= 0 || S.Objects["ball"].x + S.Objects["ball"].width >= S.Objects['field'].width)
		S.Objects["ball"].angle = normalizeAngle(Math.PI - S.Objects["ball"].angle);	
}
