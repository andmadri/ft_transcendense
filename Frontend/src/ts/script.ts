//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game } from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { initGame, saveGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getLoginFields } from './Auth/authContent.js'
import { getGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { getMenu } from './Menu/menuContent.js'
import { getLoadingPage } from './Loading/loadContent.js'

getLoadingPage();
createLog();

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	state: S.State.Menu,
	opponentType: S.OT.ONEvsONE,
	matchFormat: S.MF.SingleGame,
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: new WebSocket('wss://localhost:8443/wss'),
	matchID: -1,
	id: 0,
	name: 'unknown',
	player1Login: false, // should be Cookie
	score: 0,
	id2: 0,
	name2: 'unknown',
	player2Login: false, // should be Cookie
	score2: 0,
	playerLogin: 1,
	timeGame: 0,
	scoreLeft: 0,
	scoreRight: 0,
}

startSocketListeners();

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
window.addEventListener('resize', initAfterResize);

let lastSpeedIncreaseTime = 0;

//test to increment ball speed every minute for better AI data and more exciting game
function incrementBallSpeed() {
  if (!Game.timeGame) return;

  // Check if at least 60,000ms (1 minute) passed since last increment
  if (Game.timeGame - lastSpeedIncreaseTime >= 60000) {
    S.Objects['ball'].speed *= 1.3;  // Increase speed by 10%
    lastSpeedIncreaseTime = Game.timeGame;
  }
}

function mainLoop() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		switch (Game.state) {
			case S.State.Login: {
				if (!document.getElementById('auth1'))
					getLoginFields();
				break ;
			}
			case S.State.Menu: {
				if (!document.getElementById('menu'))
					getMenu();
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
			case S.State.Init:
				log("init game");
				if (!document.getElementById('game'))
				{
					getGameField();
					initGame();
				}
				break ;
			case S.State.Game: {
				// if (Game.matchID >= 0) 
				game();
				// if (!Game.player1Login || !Game.player2Login)
				// 	Game.state = S.State.Menu;
				break ;
			}
			case S.State.End:
				saveGame();
				log("saved game?");
				Game.state = S.State.Menu;
				break ;
			default:
				log("no valid state");
		}
		
	}
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	mainLoop();
}, 2000);
