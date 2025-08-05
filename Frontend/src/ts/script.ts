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
import { searchMatch } from './Matchmaking/onlineMatch.js'

declare const io: any;
type Socket = any;

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	state: S.State.LoginP1,
	opponentType: S.OT.ONEvsONE,
	matchFormat: S.MF.SingleGame,
	logDiv: document.getElementById('log') as HTMLDivElement,
	socket: io(`https://${window.location.host}`, {
		path: '/socket.io/', 
		transports: ['websocket'],
		secure: true,
	}),
	playMode: false,
	searchMatch: false,
	matchID: -1,
	player1Id: -1,
	player1Name: 'unknown',
	player1Login: false,
	player2Id: 1,			// default player2Id for guest login
	player2Name: 'Guest',	// default player2Name for guest login
	player2Login: false,	// default player2Login for guest login
	playerLogin: 1,
	timeGame: 0,
	scoreLeft: 0,
	scoreRight: 0,
	colletedSteps: []
}

getLoadingPage();
createLog();
log("host: " + window.location.host);
log("hostname: " + window.location.hostname);

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
	if (Game.socket.connected) {
		switch (Game.state) {
			case S.State.LoginP1: {
				if (!document.getElementById('auth1'))
					getLoginFields(1);
				break ;
			}
			case S.State.Menu: {
				if (!document.getElementById('menu') && !document.getElementById('optionMenu'))
					getMenu();
				break ;
			}
			case S.State.LoginP2: {
				if (!document.getElementById('auth2'))
					getLoginFields(2);
				if (Game.player2Id != -1)
					Game.state = S.State.Init;
				break ;
			}
			case S.State.Pending: {
				// waiting for opponement / page
				log("...pending...");
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
	mainLoop();
}, 2000);
