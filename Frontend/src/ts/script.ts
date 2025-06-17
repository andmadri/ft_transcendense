import * as GameLogic from './gameLogic.js'
import * as S from './structs.js'
import { submitInlogForm, loginSuccessfull } from './login.js'
import { initPositions } from './initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { openSocket, closeSocket, errorSocket, receiveFromWS } from './socketEvents.js'

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	loggedIn: false,
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: new WebSocket('ws://localhost:8080/ws')
}

// print msg in element 
export function log(msg: string) {
	const p = document.createElement('p');
	p.textContent = msg;
	Game.logDiv.appendChild(p);
	console.log(msg);
	}

// addEventListeners for Sokcet
Game.socket.addEventListener('open', openSocket);
Game.socket.addEventListener('error', errorSocket);
Game.socket.addEventListener('message', receiveFromWS);
Game.socket.addEventListener('close', closeSocket);

// addEventListeners for Window
window.addEventListener("keydown", pressButton);
window.addEventListener("keyup", releaseButton);
window.addEventListener("resize", initAfterResize);

// addEventListeners for Login form
document.getElementById('inlogForm')?.addEventListener('submit', submitInlogForm);


function gameLoop() {
	if (Game.socket.readyState == WebSocket.OPEN && Game.loggedIn) {
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
