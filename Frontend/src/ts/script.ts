//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import * as GameLogic from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { changeMatchFormat, changeOpponentType, initPositions, startGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getAuthField, removeAuthField } from './Auth/authContent.js'
import { getGameField, removeGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { getMenu, removeMenu } from './Menu/menuContent.js'

createLog();

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	loggedIn: false,
	gameOn: false,
	opponentType: 'none',
	matchFormat: 'none',
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: new WebSocket('wss://localhost:8443/wss'),
	timeGame: 0,
}

log('Test log: start');
startSocketListeners();

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
// window.addEventListener('resize', initAfterResize);

function mainLoop() {
	if (!Game.loggedIn)
	{
		if (!document.getElementById('auth'))
			getAuthField();
	}
	if (Game.loggedIn) {
		if (document.getElementById('auth'))
			removeAuthField();

		if (!Game.gameOn) {
			if (!document.getElementById('menu'))
				getMenu();
			if (document.getElementById('game'))
				removeGameField();
		} else {
			if (document.getElementById('menu'))
				removeMenu();
			if (!document.getElementById('game'))
			{
				getGameField();
				initPositions();
			}

			if (Game.socket.readyState == WebSocket.OPEN) {
				Game.timeGame = performance.now();
				GameLogic.checkWallCollision();
				GameLogic.checkPaddelCollision();
				GameLogic.calculateBallDir();
				GameLogic.updateBallPosition();
				if (GameLogic.checkPadelMovement())
					GameLogic.updatePadelPosition();
			}
		}
	}
	window.requestAnimationFrame(mainLoop);
}

mainLoop();
