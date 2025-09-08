//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game, pauseBallTemporarily, updateDOMElements } from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
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
import { resetBall } from '@shared/gameLogic.ts'
import { sendScoreUpdate, sendPadelHit, sendServe } from './Game/gameStateSync.js'
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

createLog();

log("host: " + window.location.host);
log("hostname: " + window.location.hostname);

startSocketListeners();

// Send a heartbeat every 10 seconds
setInterval(() => {
	if (Game.socket && Game.socket.connected) {
		Game.socket.emit('heartbeat');
	}
}, 10000);

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);

UI.state = S.stateUI.LoginP1;
window.addEventListener('popstate', (event: PopStateEvent) => {
	controlBackAndForward(event);
});

fetch('/api/playerInfo', { credentials: 'include', method: 'POST', body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' }) })
	.then(res => res.ok ? res.json() : Promise.reject())
	.then(data => {
		// User is authenticated, go to menu
		sessionStorage.setItem("currentState", "Menu");
		navigateTo('Menu');
		// NEEDED??? set UI.user1.ID = data.userId, etc.
	})
	.catch(() => {
		// Not authenticated, show login
		sessionStorage.setItem("currentState", "LoginP1");
		navigateTo('LoginP1');
});


function gameLoop() {
	switch (Game.match.state) {
		case state.Pending: {
			if (!document.getElementById('Pending'))
				getPending();
			break ;
		}
		case state.Init: {
			if (!document.getElementById('game'))
			{
				log('Init game');
				getGameField();
				initGame();
			}
			if (!document.getElementById('startGame'))
				startGameField();
			break ;
		}
		case state.Paused: {
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
		case state.Serve: {
			if (Game.match.OT != OT.Online) {
				sendServe();
			}
			Game.match.state = state.Playing;
			break ;
		}
		case state.Hit: {
			if (Game.match.OT != OT.Online) {
				sendPadelHit();
			}
			Game.match.state = state.Playing;
			break ;
		}
		case state.Score: {
			if (Game.match.OT != OT.Online) {
				sendScoreUpdate();
			}
			resetBall(Game.match.gameState.ball, Game.match.gameState.field);
			updateDOMElements(Game.match);
			Game.match.state = state.Paused;
			break ;
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
