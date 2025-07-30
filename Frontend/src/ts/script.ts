//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game } from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { initGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getLoginFields } from './Auth/authContent.js'
import { getGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { getMenu } from './Menu/menuContent.js'
import { getLoadingPage } from './Loading/loadContent.js'
import { saveGame } from './Game/endGame.js';

getLoadingPage();
createLog();

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	state: S.State.Login,
	opponentType: S.OT.ONEvsONE,
	matchFormat: S.MF.SingleGame,
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: new WebSocket('wss://localhost:8443/wss'),
	playMode: false,
	matchID: -1,
	player1Id: -1,
	player1Name: 'unknown',
	player1Login: false,
	// player1Score: 0,
	player2Id: -1,
	player2Name: 'unknown',
	player2Login: false,
	// player2Score: 0,
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
		// if (!Game.player1Login)
		// 	Game.state = S.State.Login;

		switch (Game.state) {
			case S.State.Login: {
				if (!document.getElementById('auth1'))
					getLoginFields(1);

				break ;
			}
			case S.State.Menu: {
				if (!document.getElementById('menu') && !document.getElementById('optionMenu')) // change to two different stages
				{
					// updatePlayerData(0);
					getMenu();
				}
				break ;
			}
			case S.State.Login2: {
				if (!document.getElementById('auth2'))
					getLoginFields(2);
				if (Game.player2Id != -1)
					Game.state = S.State.Init;
				break ;
			}
			case S.State.Pending: {
				// waiting for opponement
				log("No online mode yet...pending...");
				break ;
			}
			case S.State.Init:
				log("init game");
				if (!document.getElementById('game'))
				{
					log("On Init:" + JSON.stringify(Game));
					getGameField();
					initGame();
				}
				break ;
			case S.State.Game: {
				// if (Game.matchID >= 0)
				// if (Game.playMode == true)
					game();
				break ;
			}
			case S.State.End:
				saveGame();
				break ;
			default:
				log("no valid state");
		}

	}
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	log(S.host);
	mainLoop();
}, 2000);
