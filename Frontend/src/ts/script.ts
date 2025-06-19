//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import * as GameLogic from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { submitAuthForm, loginSuccessfull, changeLoginMode } from './Auth/userAuth.js' //imports two functions from login.js
import { changeMatchFormat, changeOpponentMode, initPositions, startGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { openSocket, closeSocket, errorSocket, receiveFromWS } from './socketEvents.js'

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	loggedIn: false,
	gameOn: false,
	opponentType: "none",
	matchFormat: "none",
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: new WebSocket('ws://localhost:8080/ws')
}

// print msg in element 
export function log(msg: string) {
	Game.logDiv.innerHTML = '';
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
document.getElementById('authForm')?.addEventListener('submit', submitAuthForm);
document.getElementById('toggle-mode')?.addEventListener('click', changeLoginMode);

// addEventListeners for main page
document.getElementById('startGame')?.addEventListener('click', startGame);

function gameLoop() {
	if (Game.socket.readyState == WebSocket.OPEN && Game.loggedIn && Game.gameOn) {
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
