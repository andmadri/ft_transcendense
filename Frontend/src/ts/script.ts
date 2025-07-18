//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game } from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { changeMatchFormat, changeOpponentType, initPositions, startGame, initGameServer } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getLoginFields, removeAuthField } from './Auth/authContent.js'
import { getGameField, removeGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { getMenu, removeMenu } from './Menu/menuContent.js'
import { getSideMenu, updateNamesMenu, updateScoreMenu, resetScoreMenu } from './SideMenu/SideMenuContent.js'

createLog();

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	state: S.State.Menu,
	opponentType: S.OT.Empty,
	matchFormat: S.MF.Empty,
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: new WebSocket('wss://localhost:8443/wss'),
	id: 0,
	name: 'unknown',
	player1Login: false,
	score: 0,
	id2: 0,
	name2: 'unknown',
	player2Login: false,
	score2: 0,
	playerLogin: 1
}

startSocketListeners();

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
window.addEventListener('resize', initAfterResize);

getSideMenu();

function mainLoop() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		switch (Game.state) {
			case S.State.Menu: {
				if (!document.getElementById('menu'))
					getMenu();
				break ;
			}
			case S.State.Login: {
				if (!document.getElementById('auth1'))
					getLoginFields();
				break ;
			}
			case S.State.Login2: {
				if (!document.getElementById('auth2'))
					getLoginFields();
				break ;
			}
			case S.State.Pending: {
				// waiting for opponement
				break ;
			}
			case S.State.Game: {
				if (!document.getElementById('game')) {
					getGameField();
					initPositions();
					initGameServer();
					updateNamesMenu();
					resetScoreMenu();
				}
				game();
				if (!Game.player1Login || !Game.player2Login)
					Game.state = S.State.Menu;
				break ;
			}
		}
		
	}
	window.requestAnimationFrame(mainLoop);
}

mainLoop();
