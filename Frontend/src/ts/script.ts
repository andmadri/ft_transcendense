//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game, pauseBallTemporarily, updateDOMElements} from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { initGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { getLoginFields } from './Auth/authContent.js'
import { getGameField } from './Game/gameContent.js'
import { getGameOver } from './Game/endGame.js'
import { createLog, log } from './logging.js'
import { getPending } from './Game/pendingContent.js'
import { OT, state} from '@shared/enums'
import { sendScoreUpdate } from './Game/gameStateSync.js'
import { getMenu } from './Menu/menuContent.js'
import { Game, UI } from "./gameData.js"
import { navigateTo, controlBackAndForward } from './history.js'
// import { getLoadingPage } from './Loading/loadContent.js'
import { saveGame } from './Game/endGame.js';
import { getCreditBtn, getCreditsPage } from './Menu/credits.js'
import { getSettingsPage } from './SettingMenu/settings.js'
// import { getTwoFactorFields } from './Auth/twofa.js';
import { getDashboard } from './Dashboard/dashboardContents.js'
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
	console.log(` match.state = ${Game.match.state}`);
	switch (Game.match.state) {
		case state.Pending: {
			if (!document.getElementById('Pending'))
				getPending();
			break ;
		}
		case state.Init: {
			Game.match.state = state.Playing;
			if (!document.getElementById('game'))
			{
				log('Init game');
				getGameField(); 
			}
			initGame();
			break ;
		}
		case state.Paused: {
			//maybe start with pause instead of immediately playing
			console.log(`state.Paused: ballX = ${Game.match.gameState.ball.pos.x} - ballY = ${Game.match.gameState.ball.pos.y}`);
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
			console.log(`state.Score: ballX = ${Game.match.gameState.ball.pos.x} - ballY = ${Game.match.gameState.ball.pos.y}`);
			updateDOMElements(Game.match);
			Game.match.state = state.Paused;
			if (Game.match.OT != OT.Online) {
				sendScoreUpdate();
			}
			break;
		}
		case state.End: {
			saveGame();
			setTimeout(() => {
				document.getElementById('gameOver')?.remove();
				UI.state = S.stateUI.Menu;
			}, 3000);
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
				if (!document.getElementById('menu'))
					getMenu();
				break ;
			}
			case S.stateUI.Settings: {
				if (!document.getElementById('settingPage'))
					getSettingsPage();
				break;
			}
			case S.stateUI.Credits: {
				if (!document.getElementById('Credits'))
					getCreditsPage();
				break ;
			}
			case S.stateUI.Game: {
				gameLoop();
				break ;
			}case S.stateUI.Dashboard: {
				if (!document.getElementById('dashboard'))
				{
					getDashboard();
				}
				break;
			}
			// case S.stateUI.Game: {
			// 	gameLoop();
			// 	break ;
			// }
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
