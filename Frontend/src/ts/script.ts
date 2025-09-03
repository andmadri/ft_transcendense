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
import { updatePaddlePos } from '@shared/gameLogic'
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
import { startGameField } from './Game/startGameContent.js'
// getLoadingPage();
createLog();

log("host: " + window.location.host);
log("hostname: " + window.location.hostname);

startSocketListeners();

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
// window.addEventListener('resize', initAfterResize);

UI.state = S.stateUI.LoginP1;
window.addEventListener('popstate', (event: PopStateEvent) => {
	controlBackAndForward(event);
});

let lastSpeedIncreaseTime = 0;

UI.state = S.stateUI.LoginP1;

const currentState = sessionStorage.getItem("currentState");
if (!currentState) {
    sessionStorage.setItem("currentState", "LoginP1");
}

function gameLoop() {
	switch (Game.match.state) {
		case state.Pending: {
			if (!document.getElementById('Pending'))
				getPending();
			break ;
		}
		case state.Init: {
			//console.log(`state.Init`);
			let startDuration;
			if (!document.getElementById('game')) {
				log('getGameField()');
				getGameField();
			}
			if (!document.getElementById('startGame')) {
				if (Game.match.mode == OT.Online) {
					console.log(`resumeTime = ${Game.match.resumeTime}`);
					startDuration = Game.match.resumeTime - Date.now();
				}
				else {
					startDuration = 4000;
				}
				console.log(`initGame()`);
				initGame(); // this needs to happen only once
				console.log(`startDuration = ${startDuration}`);
				startGameField(startDuration);
			}
			break ;
		}
		case state.Paused: {
			let pauseDuration;
			if (Game.match.mode == OT.Online) {
				const paddle = Game.match.player1.ID == UI.user1.ID ? Game.match.gameState.paddle1 : Game.match.gameState.paddle2;
				updatePaddlePos(paddle, Game.match.gameState.field);
				pauseDuration = Game.match.resumeTime - Date.now();
			}
			else {
				updatePaddlePos(Game.match.gameState.paddle1, Game.match.gameState.field);
				updatePaddlePos(Game.match.gameState.paddle2, Game.match.gameState.field);
				pauseDuration = 3000;
			}
			if (Game.match.pauseTimeOutID === null) {
				console.log(`pauseDuration = ${pauseDuration}`);
				pauseBallTemporarily(pauseDuration);
			}
			updateDOMElements(Game.match);
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
			if (Game.match.OT != OT.Online) {
				Game.match.state = state.Paused;
				sendScoreUpdate();
			}
			break;
		}
		case state.End: {
			saveGame();
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
				if (!document.getElementById('dashboard')) {
					getDashboard();
				}
				break;
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
