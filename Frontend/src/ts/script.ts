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
import { saveGame } from './Game/initGame.js';
import { getLoadingPage, removeLoadingPage } from './Loading/loadContent.js'

getLoadingPage();
createLog();

export const Game: S.gameInfo = {
		state: S.State.Menu,
		opponentType: S.OT.Empty,
		matchFormat: S.MF.Empty,
		logDiv: document.getElementById('log') as HTMLDivElement,
		socket: new WebSocket('wss://localhost:8443/wss'),
		matchID: -1,
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

function mainLoop() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		switch (Game.state) {
			case S.State.Menu:
				if (!document.getElementById('menu'))
					getMenu();
				else
					log("menu is already there");
				break ;
			case S.State.Login:
				if (!document.getElementById('auth1'))
					getLoginFields();
				break ;
			case S.State.Login2:
				if (!document.getElementById('auth2'))
					getLoginFields();
				break ;
			case S.State.Pending:
				// waiting for opponement
				// if ready -> make match
				break ;
			case S.State.Init:
				log("init game");
				if (!document.getElementById('game'))
					getGameField();
				initPositions();
				initGameServer();
				updateNamesMenu();
				resetScoreMenu();
				Game.state = S.State.Game;
				break ;
			case S.State.Game:
				if (!Game.player1Login || !Game.player2Login)
					Game.state = S.State.End;
				if (Game.matchID >= 0) // waiting till the match is made by backend
					game();
				break ;
			case S.State.End:
				saveGame();
				log("saved game?");
				Game.state = S.State.Menu;
				break ;
			default:
				log("no valid state");

		}
	} else
		log("socket is closed")
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	removeLoadingPage();
	mainLoop();
}, 2000);
