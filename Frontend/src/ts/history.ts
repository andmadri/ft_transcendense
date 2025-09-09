import { Game, UI } from './gameData.js';
import { cancelOnlineMatch } from './Matchmaking/onlineMatch.js';
import * as S from './structs.js'
import { state } from '@shared/enums'
import { getGameOver } from './Game/endGame.js';
import { getGameStats } from './Game/gameStats.js';
import { log } from './logging.js';

/**
 * NAVIGATION FOR
 * LoginP1
 * LoginP2
 * Menu
 * Settings
 * Game
 * Stats
 * Credits
 */

function getMatchIdFromHash(): number | null {
	// hash looks like: "#GameStats?matchId=123"
	const hash = window.location.hash || '';
	const q = hash.indexOf('?');
	if (q === -1) 
		return null;
	const params = new URLSearchParams(hash.slice(q + 1));
	const id = params.get('matchId');
	if (!id) 
		return null;
	const n = Number(id);
	return Number.isFinite(n) ? n : null;
}

export function initRoutingOnLoad() {
	if (!window.location.hash)
		return;
	const hash = window.location.hash.replace(/^#/, '');
	const state = (hash.split('?')[0] || 'Menu');

	log(`initRoutingOnLoad: state=${state}`);
	console.log(`initRoutingOnLoad: state=${state}`);

	// Try to get matchId if present
	const matchId = getMatchIdFromHash();
	renderPage(state, { matchId: matchId ?? undefined });
}

/**
 * @brief Checks auth for protected pages and renders page
 * @param state new state
 */
export function renderPage (newState: string, opts?: { matchId?: number }) {
	// Protect Menu and other pages
	const unprotecedPages = ['LoginP1'];
	if (!unprotecedPages.includes(state)) {
		fetch('/api/playerInfo', {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' })
		})
			.then(res => res.ok ? res.json() : Promise.reject())
			.then(data => {
				// User is authenticated, continue rendering
				doRenderPage(newState, {matchId: Number(opts?.matchId)});
			})
			.catch(() => {
				// Not authenticated, redirect to login
				sessionStorage.setItem("currentState", "LoginP1");
				doRenderPage('LoginP1');
			});
		return ;
	}
	doRenderPage(newState, {matchId: Number(opts?.matchId)});
}

/**
 * @brief change state or shows new page
 * @param state new state
 */
export function doRenderPage(newState: string, opts?: { matchId?: number }) {
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
		case 'Dashboard':
			document.getElementById("settingPage")?.remove();
			UI.state = S.stateUI.Dashboard;
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
			getGameOver( {matchId: Number(opts?.matchId)} );
			break ;
		case 'GameStats':
			UI.state = S.stateUI.GameStats;

			const id = Number.isFinite(opts?.matchId as number) ? Number(opts!.matchId) : getMatchIdFromHash();
			if (id != null) {
				requestAnimationFrame(() => getGameStats({ matchId: id }));
			} else {
				console.warn('GameStats: no matchId found');
			}
			break;
		default:
			console.log(`Page does not exist: ${newState}`);
			UI.state = S.stateUI.Menu;
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
export function navigateTo(state: string, opts?: { matchId?: number }) {
	if (state == null)
		return ('LoginP1');
	// Central auth check for protected pages
	const unprotecedPages = ['LoginP1'];
	if (!unprotecedPages.includes(state)) {
		// Only allow if authenticated
		fetch('/api/playerInfo', { credentials: 'include', method: 'POST', body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' }) })
			.then(res => res.ok ? res.json() : Promise.reject())
			.then(data => {
				continueNavigation(state, {matchId: Number(opts?.matchId)});
			})
			.catch(() => {
				sessionStorage.setItem("currentState", "LoginP1");
				continueNavigation('LoginP1');
			});
		return;
	}
	continueNavigation(state, {matchId: Number(opts?.matchId)});
}

/**
 * @brief Saves current state in history and navigates to page
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 */
function continueNavigation(state: string, opts?: { matchId?: number }) {
	console.log(`Save navigation to: ${state}`);
	sessionStorage.setItem('history', state);

	let hash = `#${state}`;
	if (state === 'GameStats') {
		// Prefer explicit param; otherwise preserve the current one from the URL
		const id = Number.isFinite(opts?.matchId as number) ? Number(opts!.matchId) : getMatchIdFromHash();
		if (id != null) {
			// const desired = `#GameStats?matchId=${id}`;
			// if (window.location.hash === desired && UI.state === S.stateUI.GameStats) {
			// 	return ;
			// }
			// hash = desired;
			hash = `#GameStats?matchId=${id}`;
		}
	}
	
	if (history.state === state) {
		history.replaceState(state, '', hash);
		renderPage(state, opts);
	} else {
		history.pushState(state, '', hash);
		renderPage(state, opts);
	}
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
export function getValidState(state: string): string {
	const currentState = sessionStorage.getItem("currentState");

	// Is already logged in
    if (state !== 'LoginP1' && state !== 'GameStats' && UI.user1.ID == -1) {
		log("state !== 'LoginP1' && state !== 'GameStats' && UI.user1.ID == -1")
		return ('Menu');
	}

	// No match is started
    if ((state === 'Game' || state === 'GameOver') && Game.match.matchID == -1) {
		log("state === 'Game' || state === 'GameOver') && Game.match.matchID == -1")
		return ('Menu');
	}

	// When logged in not back to loginpage	
	if (currentState == 'Menu' && state == 'LoginP1') {
		log("currentState == 'Menu' && state == 'LoginP1'")
		return ('Menu');
	}

	if (currentState == 'Menu' && (state === 'Game' || state === 'GameOver')) {
		log("currentState == 'Menu' && (state === 'Game' || state === 'GameOver'")
		return ('Menu');
	}

    const allowedPages = ['Menu', 'Game', 'Credits', 'LoginP1', 'LoginP2',
		'Settings', 'Dashboard', 'GameOver', 'GameStats'];
	for (const page of allowedPages) {
		if (page == state) {
			return state;
		}
	}
    return ('Menu');
}

/**
 * @brief activate when back/forward btn is pushed. Checks if valid and renders page
 * @param event PopStateEvent
 */
export function controlBackAndForward(event: PopStateEvent) {
	const state = event.state as string;
	const currentState = sessionStorage.getItem("currentState");
	
	const validState = getValidState(state);
	history.replaceState(validState, '', window.location.hash);

	console.log(`State: ${state} -> validState: ${validState}, currentState: ${currentState}`)
	// Always go back to menu and stop game
	if (currentState == 'Game') {
		cancelOnlineMatch();
		stopCurrentGame();
		renderPage('Menu');
		return ;
	}

	if (validState) {
		renderPage(validState, { matchId: getMatchIdFromHash() ?? undefined });
	} else {
		renderPage('Menu'); // fallback
	}
}
