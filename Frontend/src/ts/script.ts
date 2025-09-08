//Initialize the game by setting up the WebSocket connection, the login system, the game state
//importing functionality from different files

import { game, pauseBallTemporarily, updateDOMElements} from './Game/gameLogic.js' //imports everything from gamelogic.js with namespace GameLogic
import * as S from './structs.js' //imports structures from the file structs.js
import { initGame } from './Game/initGame.js'
import { pressButton, releaseButton, initAfterResize } from './windowEvents.js'
import { getLoginFields } from './Auth/authContent.js'
import { getGameField } from './Game/gameContent.js'
import { createLog, log } from './logging.js'
import { getPending } from './Game/pendingContent.js'
import { OT, state} from '@shared/enums'
import { resetBall } from '@shared/gameLogic'
import { updatePaddlePos } from '@shared/gameLogic'
import { sendScoreUpdate, sendPadelHit, sendServe } from './Game/gameStateSync.js'
import { getMenu } from './Menu/menuContent.js'
import { Game, UI } from "./gameData.js"
import { navigateTo, controlBackAndForward } from './history.js'
import { saveGame } from './Game/endGame.js';
import { getCreditsPage } from './Menu/credits.js'
import { getSettingsPage } from './SettingMenu/settings.js'
import { getDashboard } from './Dashboard/dashboardContents.js'
import { startGameField } from './Game/startGameContent.js'
import { initSocket } from './socketEvents.js'
import { getLoadingPage } from './Loading/loadContent.js'
import { initRoutingOnLoad } from './history.js'
// import { startSocketListeners } from './socketEvents.js'

createLog();

log("host: " + window.location.host);
log("hostname: " + window.location.hostname);

// startSocketListeners();

async function checkCookie() {
	const lastPage = sessionStorage.getItem("currentState");
	let url = `https://${S.host}/api/cookie`;
	if (lastPage)
		url = `https://${S.host}/api/cookie?lastPage=${encodeURIComponent(lastPage)}`;

	const response = await fetch(url, { credentials: 'include' })
	if (response.ok) {
		console.log("Cookie valid, open socket direct");

		// SET name because otherwise it is to slow for the menu later?
		const data = await response.json();
		if (data.userID)
			UI.user1.ID = data.userID;
		if (data.name)
			UI.user1.name = data.name;
		initSocket();
		navigateTo(lastPage || "LoginP1");
	} else {
		console.log("No valid cookie..");
		navigateTo("LoginP1");
	}
	mainLoop();
};

checkCookie();

// Send a heartbeat every 10 seconds
setInterval(() => {
	if (Game.socket && Game.socket.connected) {
		Game.socket.emit('heartbeat');
	}
}, 5000);

// addEventListeners for Window
window.addEventListener('keydown', pressButton);
window.addEventListener('keyup', releaseButton);
// window.addEventListener('resize', initAfterResize);

initRoutingOnLoad();
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

function isReadyToConnect() {
	if (Game.socketStatus !== S.SocketStatus.Connected) {
		if (!document.getElementById('loadingpage')) {
			document.body.innerHTML = '';
			const loadingPage = getLoadingPage();
			document.body.appendChild(loadingPage);
			return(false);
		}
	} else {
		document.getElementById('loadingpage')?.remove();
		return(true);
	}
}

function mainLoop() {
	if (UI.state === S.stateUI.LoginP1) {
		if (!document.getElementById('auth1'))
			getLoginFields(1);
	} else if (isReadyToConnect()) {
		switch (UI.state) {
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
				if (isReadyToConnect())
					gameLoop();
				break ;
			} case S.stateUI.Dashboard: {
				if (!document.getElementById('dashboard')) {
					getDashboard();
				}
			break;
			}
			default:
		}
	} else {
		if (!Game.socket || Game.socketStatus === S.SocketStatus.Disconnected) {
			initSocket();
		}
	}
	window.requestAnimationFrame(mainLoop);
}

// function mainLoop() {
// 	if (Game.socket.connected) {
// 		switch (UI.state) {
// 			case S.stateUI.LoginP1: {
// 				if (!document.getElementById('auth1'))
// 					getLoginFields(1);
// 				break ;
// 			}
// 			case S.stateUI.LoginP2: {
// 				if (!document.getElementById('auth2'))
// 					getLoginFields(2);
// 				break ;
// 			}
// 			case S.stateUI.Menu: {
// 				document.getElementById('auth1')?.remove();
// 				document.getElementById('auth2')?.remove();
// 				if (!document.getElementById('menu'))
// 					getMenu();
// 				break ;
// 			}
// 			case S.stateUI.Settings: {
// 				if (!document.getElementById('settingPage'))
// 					getSettingsPage();
// 				break;
// 			}
// 			case S.stateUI.Credits: {
// 				if (!document.getElementById('Credits'))
// 					getCreditsPage();
// 				break ;
// 			}
// 			case S.stateUI.Game: {
// 				// if (isReadyToConnect())
// 					gameLoop();
// 				break ;
// 			} case S.stateUI.Dashboard: {
// 				if (!document.getElementById('dashboard')) {
// 					getDashboard();
// 				}
// 			break;
// 			}
// 			default:
// 		}
// 	} else {
// 		log("Socket not connected, trying to reconnect...");
// 		Game.socket.connect();
// 	}
// 	window.requestAnimationFrame(mainLoop);
// }

// setTimeout(() => {
// 	mainLoop();
// }, 1000);