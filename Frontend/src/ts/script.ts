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
import { OT, state, MF } from '@shared/enums'
import { getMenu } from './Menu/menuContent.js'
import { Game, UI } from "./gameData.js"
import { navigateTo, controlBackAndForward } from './history.js'
// import { getLoadingPage } from './Loading/loadContent.js'
import { saveGame } from './Game/endGame.js';
import { historyState } from './history.js'
// import { getTwoFactorFields } from './Auth/twofa.js';

// getLoadingPage();
createLog();

log("host: " + window.location.host);
log("hostname: " + window.location.hostname);

startSocketListeners();

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
// window.addEventListener('resize', initAfterResize);

navigateTo('LoginP1');
window.addEventListener('popstate', (event: PopStateEvent) => {
	controlBackAndForward(event);
});

let lastSpeedIncreaseTime = 0;

function gameLoop() {
	switch (Game.match.state) {
		case state.Pending: {
			log("...pending...");
			break ;
		}
		case state.Init:
			if (!document.getElementById('game'))
			{
				log('Init game');
				getGameField();
				initGame();
				Game.match.state = state.Playing;
				console.log(`player one = ${Game.match.gameState.paddle1.pos.y} , player two = ${Game.match.gameState.paddle2.pos.y} , ballX = ${Game.match.gameState.ball.pos.x} , ballY = ${Game.match.gameState.ball.pos.y}`);
			}
			break ;
		case state.Playing: {
			document.getElementById('auth1')?.remove();
			document.getElementById('auth2')?.remove();
			game();
			break ;
		}
		case state.End:
			saveGame();
			navigateTo('Menu');
			break ;
		default:
	}
}

function mainLoop() {
	if (Game.socket.connected) {
		switch (UI.state) {
			case S.stateUI.LoginP1: {
				if (!document.getElementById('auth1'))
					getLoginFields(1);
				break ;
			}
			case S.stateUI.LoginP2: {
				if (!document.getElementById('auth2'))
					getLoginFields(2);
				break ;
			}
			case S.stateUI.Menu: {
				document.getElementById('auth1')?.remove();
				document.getElementById('auth2')?.remove();
				if (!document.getElementById('menu') && !document.getElementById('optionMenu'))
					getMenu();
				break ;
			}
			case S.stateUI.Game: {
				gameLoop();
				break ;
			}
			default:
		}
	} else {
		log("Socket not connected, trying to reconnect...");
		Game.socket.connect();
	}
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	mainLoop();
}, 1000);
