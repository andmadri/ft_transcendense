//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files
import * as S from './structs.js' //imports structures from the file structs.js
import { Game, UI } from "./gameData.js"
import { navigateTo, controlBackAndForward, onHashChange } from './history.js'
import { createLog, log } from './logging.js'
import { pressButton, releaseButton } from './windowEvents.js'
import { startSocketListeners } from './socketEvents.js'
import { game, pauseBallTemporarily, updateDOMElements} from './Game/gameLogic.js'
import { initGame } from './Game/initGame.js'
import { getPending } from './Game/pendingContent.js'
import { sendScoreUpdate, sendPadelHit, sendServe } from './Game/gameStateSync.js'
import { saveGame } from './Game/endGame.js';
import { getGameField } from './Game/gameContent.js'
import { startGameField } from './Game/startGameContent.js'
import { getLoginFields } from './Auth/authContent.js'
import { getMenu } from './Menu/menuContent.js'
import { getCreditsPage } from './Menu/credits.js'
import { getSettingsPage } from './SettingMenu/settings.js'
import { getLoadingPage } from './Loading/loadContent.js'
import { OT, state} from '@shared/enums'
import { resetBall } from '@shared/gameLogic'
import { updatePaddlePos } from '@shared/gameLogic'

createLog();

log("host: " + window.location.host);

startSocketListeners();

// Send a heartbeat every 10 seconds
setInterval(() => {
	if (Game.socket && Game.socket.connected) {
		Game.socket.emit('heartbeat', {menu: UI.state === S.stateUI.Menu});
	}
}, 5000);

window.addEventListener("hashchange", () => { onHashChange(); });
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
window.addEventListener('popstate', (event: PopStateEvent) => { controlBackAndForward(event); });

// On page load, check auth and navigate to the correct page
fetch('/api/playerInfo', { credentials: 'include', method: 'POST', body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' }) })
	.then(res => res.ok ? res.json() : Promise.reject())
	.then(data => {
		// User is authenticated, go to menu
		const currentState = sessionStorage.getItem("currentState");
		if (currentState && currentState !== 'LoginP1')
			navigateTo(currentState);
		else
			navigateTo('Menu');
	})
	.catch(() => {
		// Not authenticated, show login
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
		case state.Serve: {
			if (Game.match.mode != OT.Online) {
				sendServe();
			}
			Game.match.state = state.Playing;
			break ;
		}
		case state.Hit: {
			if (Game.match.mode != OT.Online) {
				sendPadelHit();
			}
			Game.match.state = state.Playing;
			break ;
		}
		case state.Score: {
			if (Game.match.mode != OT.Online) {
				sendScoreUpdate();
				resetBall(Game.match.gameState.ball, Game.match.gameState.field);
			}
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
			}
			default:
		}
	} else {
		console.warn("Socket not connected, trying to reconnect...");
		if (!document.getElementById('loadingpage')) {
			document.body.innerHTML = '';
			getLoadingPage();
		}
		Game.socket.connect();
	}
	window.requestAnimationFrame(mainLoop);
}

setTimeout(() => {
	mainLoop();
}, 1000);