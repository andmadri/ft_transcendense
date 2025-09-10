import * as S from './structs.js'
import { state } from '@shared/enums'
import { Game, UI } from './gameData.js';
import { cancelOnlineMatch } from './Matchmaking/onlineMatch.js';
import { getGameOver } from './Game/endGame.js';
import { getGameStats } from './Game/gameStats.js';
import { getDashboard } from './Dashboard/dashboardContents.js';
import { log } from './logging.js';

/**
 * @brief Triggered on hash change, navigates to the new state
 */
export function onHashChange() {
  const hash = window.location.hash.replace(/^#/, '');
  navigateTo(hash, true);
};

/**
 * @brief Extracts the matchId or userId from the hash
 * @param hash window.location.hash
 * @param type matchId or userId
 * @returns matchId or userId or null
 * hash looks like: "#GameStats?matchId=123"
 */
function getIdFromHash(hash: string, type: string): number | null {
	const q = hash.indexOf('?');
	if (q === -1) 
		return null;
	const params = new URLSearchParams(hash.slice(q + 1));
	const id = params.get(type);
	if (!id) 
		return null;
	const n = Number(id);
	return (Number.isFinite(n) ? n : null);
}

/**
 * @brief Checks auth for protected pages and renders page
 * @param state new state
 */
export function renderPage(newState: string) {
	// Protect Menu and other pages
	const unprotecedPages = ['LoginP1'];
	if (!unprotecedPages.includes(newState)) {
		fetch('/api/playerInfo', {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' })
		})
			.then(res => res.ok ? res.json() : Promise.reject())
			.then(data => {
				// User is authenticated, continue rendering
				doRenderPage(newState);
			})
			.catch(() => {
				// Not authenticated, redirect to login
				doRenderPage('LoginP1');
			});
		return ;
	}
	doRenderPage(newState);
}

/**
 * @brief change state or shows new page
 * @param state new state
 */
export function doRenderPage(newState: string) {
	switch (newState) {
		case 'LoginP1':
			UI.state = S.stateUI.LoginP1;
			break ;
		case 'LoginP2':
			UI.state = S.stateUI.LoginP2;
			break;
		case 'Menu':
			document.getElementById("creditDiv")?.remove();
			document.getElementById("containerDashboard")?.remove();
			document.getElementById("settingPage")?.remove();
			document.getElementById("gameOver")?.remove();
			UI.state = S.stateUI.Menu;
			break ;
		case 'Credits':
			UI.state = S.stateUI.Credits;
			break ;
		case 'Settings':
			UI.state = S.stateUI.Settings;
			break ;
		case 'Pending':
			Game.match.state = state.Pending;
			break ;
		case 'Game':
			UI.state = S.stateUI.Game;
			break ;
		case 'GameOver':
			UI.state = S.stateUI.GameOver;
			getGameOver();
			break ;
		default:
			if (newState.includes('GameStats')) {
				UI.state = S.stateUI.GameStats;
				const matchId = getIdFromHash(newState, "matchId");
				// Add a check that the number is in range of matchId
				if (matchId != null) {
					requestAnimationFrame(() => getGameStats(matchId));
				} else {
					console.warn('GameStats: no matchId found');
					UI.state = S.stateUI.Menu;
				}
			} else if (newState.includes('Dashboard')) {
				UI.state = S.stateUI.Dashboard;
				const userId = getIdFromHash(newState, "userId");
				// Add a check that the number is in range of userId
				if (userId != null) {
					requestAnimationFrame(() => getDashboard(userId));
				} else {
					console.warn('Dashboard: no userId found');
					UI.state = S.stateUI.Menu;
				}
			} else {
				console.warn(`Page does not exist: ${newState}`);
				UI.state = S.stateUI.Menu;
			}
	}
	sessionStorage.setItem("currentState", newState);
}

/**
 * @brief Saves current state in history and navigates to page by using continueNavigation
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 * Central auth check for protected pages
 */
export function navigateTo(newState: string, fromHash = false) {
	if (!newState) {
		console.warn('navigateTo called with empty state');
		return;
	}

	if (fromHash) {
		newState = getValidState(newState, sessionStorage.getItem("currentState") || '');
	}
	// Central auth check for protected pages
	const unprotecedPages = ['LoginP1'];
	if (!unprotecedPages.includes(newState)) {
		// Only allow if authenticated
		fetch('/api/playerInfo', { credentials: 'include', method: 'POST', body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' }) })
			.then(res => res.ok ? res.json() : Promise.reject())
			.then(data => {
				continueNavigation(newState);
			})
			.catch(() => {
				continueNavigation('LoginP1');
			});
		return;
	}
	continueNavigation(newState);
}

/**
 * @brief Saves current state in history and navigates to page
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 */
function continueNavigation(newState: string) {
	console.log(`Save navigation to: ${newState}`);
	sessionStorage.setItem('history', newState);

	history.pushState(newState, '', `#${newState}`);
	renderPage(newState);
}

function stopCurrentGame() {
	Game.socket.emit('message', { 
		action: 'game',
		subaction: 'quit',
		matchID: Game.match.matchID,
		player: Game.match.player1.ID,
		name: Game.match.player1.name
	});
}

/**
 * @brief checks certain conditions if dir is possible and if page name is allowed
 * @param state asked page name
 * @returns de (new) state, is changed if conditions where right
 */
export function getValidState(newState: string, currentState: string): string {
	if (newState == null || newState == undefined || newState.length == 0) {
		return ('Menu');
	}

	// Is already logged in
    if (newState !== 'LoginP1' && UI.user1.ID == -1) {
		return ('Menu');
	}

	// No match is started
    if ((newState === 'Game' || newState === 'GameOver') && Game.match.matchID == -1) {
		return ('Menu');
	}

	// When logged in not back to loginpage	
	if (currentState == 'Menu' && newState == 'LoginP1') {
		return ('Menu');
	}

	if (currentState == 'Menu' && (newState === 'Game' || newState === 'GameOver')) {
		return ('Menu');
	}

	const allowedPages = ['Menu', 'Game', 'Credits', 'LoginP1', 'LoginP2', 'Settings', 'GameOver'];
	for (const page of allowedPages) {
		if (page == newState) {
			return newState;
		}
	}
	if (newState.includes('GameStats')) {
		return (newState);
	}
	if (newState.includes('Dashboard')) {
		return (newState);
	}
    return ('Menu');
}

/**
 * @brief activate when back/forward btn is pushed. Checks if valid and renders page
 * @param event PopStateEvent
 */
export function controlBackAndForward(event: PopStateEvent) {
	const newState = event.state as string;
	const currentState = sessionStorage.getItem("currentState");
	const validState = getValidState(newState, currentState ? currentState : '');
	history.replaceState(validState, '', window.location.hash);

	// Always go back to menu and stop game
	if (currentState == 'Game') {
		cancelOnlineMatch();
		stopCurrentGame();
		renderPage('Menu');
		return ;
	}

	if (validState) {
		renderPage(validState);
	} else {
		renderPage('Menu'); // fallback
	}
}
