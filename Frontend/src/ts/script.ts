//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game, pauseBallTemporarily, updateDOMElements} from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { initGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getLoginFields } from './Auth/authContent.js'
import { getGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { OT, state} from '@shared/enums'
import { sendScoreUpdate } from './Game/gameStateSync.js'
import { getMenu } from './Menu/menuContent.js'
import { Game, UI } from "./gameData.js"
// import { getLoadingPage } from './Loading/loadContent.js'
import { saveGame } from './Game/endGame.js';
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

let lastSpeedIncreaseTime = 0;

function gameLoop() {
	switch (Game.match.state) {
		case state.Pending: {
			// waiting for opponement
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
			}
			break ;
		case state.Paused: {
			//maybe start with pause instead of immediately playing
			//maybe send score here in local mode, cause ball is paused when point is scored ?? 
			if (Game.match.pauseTimeOutID === null) {
				pauseBallTemporarily(3000);
			}
			break ;
		}
		case state.Playing: {
			document.getElementById('auth1')?.remove();
			document.getElementById('auth2')?.remove();
			game(Game.match);
			break ;
		}
		case state.Score: {
			updateDOMElements(Game.match);
			Game.match.state = state.Paused;
			if (Game.match.OT != OT.Online) {
				sendScoreUpdate();
			}
			break;
		}
		case state.End: {
			saveGame();
			UI.state = S.stateUI.Menu; //gameOver doesn't work correctly
			break ;
		}
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
	}
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	mainLoop();
}, 1000);
