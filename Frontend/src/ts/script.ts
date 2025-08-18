//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game } from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { OT, Stage } from '@shared/enums'
import { initGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getLoginFields } from './Auth/authContent.js'
import { getGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { getMenu } from './Menu/menuContent.js'
// import { getLoadingPage } from './Loading/loadContent.js'
import { saveGame } from './Game/endGame.js';


// getLoadingPage();
createLog();
declare const io: any;
type Socket = any;

// Prepare Div for error and create a new socket
export const Game: S.gameInfo = {
	state: S.State.LoginP1,
	opponentType: OT.ONEvsONE,
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
	player1Name: 'unknown',	// Add later: getUserID from DB
	player1Login: false,
	player2Id: 1,			// default player2Id for guest login
	player2Name: 'Guest',		// Add later: getUserID from DB // default player2Name for guest login
	player2Login: false,	// default player2Login for guest login
	playerLogin: 1,
	timeGame: 0,
	scoreLeft: 0,
	scoreRight: 0,
	colletedSteps: [],
	ballPaused: false
}

log("host: " + window.location.host);
log("hostname: " + window.location.hostname);

startSocketListeners();

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
// window.addEventListener('resize', initAfterResize);

let lastSpeedIncreaseTime = 0;

function mainLoop() {
	if (Game.socket.connected) {
		switch (Game.state) {
			case S.State.LoginP1: {
				if (!document.getElementById('auth1'))
					getLoginFields(1);
				break ;
			}
			case S.State.LoginP2: {
				if (!document.getElementById('auth2'))
					getLoginFields(2);
				break ;
			}
			case S.State.Menu: {
				// document.getElementById('auth1')?.remove();
				// document.getElementById('auth2')?.remove();
				if (!document.getElementById('menu') && !document.getElementById('optionMenu'))
					getMenu();
				break ;
			}
			case Stage.Pending: {
				// waiting for opponement
				log("...pending...");
				break ;
			}
			case Stage.Init:
				if (!document.getElementById('game'))
				{
					getGameField();
					initGame();
					
				}
				break ;
			case Stage.Playing: {
				// document.getElementById('auth1')?.remove();
				// document.getElementById('auth2')?.remove();
				// if (Game.matchID >= 0)
				// if (Game.playMode == true)
					game();
				break ;
			}
			case Stage.End:
				saveGame();
				break ;
			default:
		}

	}
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	mainLoop();
}, 1000);
