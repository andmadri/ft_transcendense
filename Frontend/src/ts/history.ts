import * as S from './structs.js'
import { state } from '@shared/enums'
import { Game, UI, newMatch } from './gameData.js';
import { cancelOnlineMatch } from './Matchmaking/onlineMatch.js';
import { getGameOver } from './Game/endGame.js';
import { askForGamestats } from './Game/gameStats.js';
import { getDashboard } from './Dashboard/dashboardContents.js';
import { validateQuery } from './Dashboard/exists.js';
import { resetAI } from './Game/aiLogic.js';

function splitHash(hash: string) {
	const cleanHash = hash.replace(/^#/, '');
	const indexQ = cleanHash.indexOf('?');
	if (indexQ == -1)
		return [ cleanHash || 'Menu', ''];
	else
		return [ cleanHash.slice(0, indexQ), cleanHash.slice(indexQ + 1)];
}

/**
 * @brief Triggered on hash change, navigates to the new state
 */
export function onHashChange() {
	const [ page, query ] = splitHash(window.location.hash);
	console.log('onHashChange -> page:', page, 'query:', query);
	navigateTo(page + (query ? `?${query}` : ''), true);
};

/**
 * @brief Extracts the matchId from the hash
 * @param hash window.location.hash
 * @returns matchId or null
 * hash looks like: "#GameStats?matchId=123"
 */
function getIdFromHash(hash: string, type: string): number | null {
	const params = new URLSearchParams(hash);
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
export function renderPage (newState: string, query: string, infoIsChecked: boolean) {
	// Protect Menu and other pages
	const unprotecedPages = ['LoginP1'];
	if (!unprotecedPages.includes(newState) && !infoIsChecked) {
		fetch('/api/playerInfo', {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' })
		})
			.then(res => res.ok ? res.json() : Promise.reject())
			.then(data => {
				// User is authenticated, continue rendering
				doRenderPage(newState, query);
			})
			.catch(() => {
				// Not authenticated, redirect to login
				doRenderPage('LoginP1', query);
			});
		return ;
	}
	doRenderPage(newState, query);
}

/**
 * @brief change state or shows new page
 * @param state new state
 */
export function doRenderPage(newState: string, query?: string) {
	switch (newState) {
		case 'LoginP1':
			UI.state = S.stateUI.LoginP1;
			break ;
		case 'LoginP2':
			UI.state = S.stateUI.LoginP2;
			break;
		case 'Menu':
			UI.state = S.stateUI.Menu;
			break ;
		case 'Credits':
			UI.state = S.stateUI.Credits;
			break ;
		case 'OpponentMenu':
			Game.match = newMatch(); // IDK if this is the best spot for it, but anywhere else causes issues
			resetAI(Game.match);
			UI.state = S.stateUI.OpponentMenu;
			break ;
		case 'Game':
			UI.state = S.stateUI.Game;
			break ;
		case 'Pending':
			Game.match.state = state.Pending;
			break ;
		case 'Tournament':
			UI.state = S.stateUI.Tournament;
			break;
		case 'GameOver':
			UI.state = S.stateUI.GameOver;
			getGameOver();
			break ;
		case 'GameStats':
			UI.state = S.stateUI.GameStats;
			let id = null;
			if (query)
				id = getIdFromHash(query, "matchId");
			if (id != null) {
				requestAnimationFrame(() => askForGamestats(id));
			} else {
				console.warn('GameStats: no matchId found');
				navigateTo('Menu');
			}
			break;
		case 'Dashboard':
			UI.state = S.stateUI.Dashboard;
			let userId = null;
			if (query)
				userId = getIdFromHash(query, "userId");
			// Add a check that the number is in range of userId
			if (userId != null) {
				requestAnimationFrame(() => getDashboard(userId, 1));
			} else {
				console.warn('Dashboard: no userId found');
				navigateTo('Menu');
			}
			break;
		default:
			console.warn(`Page does not exist: ${newState}`);
			navigateTo('Menu');
	}

	const pagesWithQuery = ['Dashboard', 'GameStats'];
	if (query && query != '' && pagesWithQuery.includes(newState))
		sessionStorage.setItem("currentState", newState + '?' + query);
	else
		sessionStorage.setItem("currentState", newState);
}

/**
 * @brief Saves current state in history and navigates to page by using continueNavigation
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 * Central auth check for protected pages
 */
export function navigateTo(newState: any, fromHash = false) {
	if (!newState) {
		console.warn('navigateTo called with empty state');
		return;
	}
	let [ page, query ] = splitHash(newState);
	if (page === 'GameOver') {
		newState = page;
	}

	if (fromHash)
		page = getValidState(page, sessionStorage.getItem("currentState") || '');
	console.log('newState', newState, 'page', page, 'current', sessionStorage.getItem("currentState"), 'id', Game.match.matchID)

	if (newState === 'LoginP2' && page === 'LoginP2' && sessionStorage.getItem("currentState") === 'LoginP2' && UI.user1.ID != -1 && UI.user2.ID != -1) {
		// Prevent infinite loop when already on LoginP2
		console.log('Already logged in P2, navigating to menu instead');
		newState = 'Menu';
		page = 'Menu';
	}

	// Central auth check for protected pages
	const unprotecedPages = ['LoginP1'];
	if (!unprotecedPages.includes(page)) {
		// Only allow if authenticated
		fetch('/api/playerInfo', { credentials: 'include', method: 'POST', body: JSON.stringify({ action: 'playerInfo', subaction: 'getPlayerData' }) })
			.then(res => res.ok ? res.json() : Promise.reject())
			.then(data => {
				continueNavigation(page, query, true);
			})
			.catch(() => {
				continueNavigation('LoginP1', query, true);
			});
		return;
	}
	continueNavigation(newState, query, false);
}

/**
 * @brief Saves current state in history and navigates to page
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 */
function continueNavigation(newState: string, query: string, infoIsChecked: boolean) {
	sessionStorage.setItem('history', newState);
	const stateObj = { page: newState, ts: Date.now(), query:  query};
	if (newState !== 'GameOver' && query && query.length > 0)
		history.pushState(stateObj, '',  query ? `#${newState}?${query}` : `#${newState}`);
	else
		history.pushState(stateObj, '', `#${newState}`);
	renderPage(newState, query, infoIsChecked);
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

	// Is not logged in
    if (newState !== 'LoginP1' && UI.user1.ID == -1) {
		return ('LoginP1');
	}

	// No match is started
    if ((newState == 'Game' || newState == 'GameOver') && Game.match.matchID == -1) {
		return ('Menu');
	}

	// When logged in not back to loginpage
	if (currentState == 'Menu' && newState == 'LoginP1') {
		return ('Menu');
	}

	if (currentState == 'Game' && newState == 'Game') {
		if (Game.match.state != state.End) {
			Game.match.state = state.End;
			return ('GameOver');
		}
	}

	if (currentState == 'Menu' && (newState === 'Game' || newState === 'GameOver')) {
		return ('Menu');
	}

	const allowedPages = ['Menu', 'Game', 'Credits', 'LoginP1', 'LoginP2',
		'OpponentMenu', 'Dashboard', 'Tournament', 'GameStats', 'GameOver'];
	for (const page of allowedPages) {
		if (page == newState) {
			return newState;
		}
	}
	return ('Menu');
}

/**
 * @brief activate when back/forward btn is pushed. Checks if valid and renders page
 * @param event PopStateEvent
 */
export async function controlBackAndForward(event: PopStateEvent) {
	console.log('popstate event:', event.state, 'hash:', window.location.hash);
	
	let newState = event.state?.page;
	if (!newState) {
		newState = window.location.hash || 'Menu';
	}
	let [ page, query ] = splitHash(newState);
	if (event.state && event.state.query) {
		query = event.state.query;
	}
	const validQuery = await validateQuery(page, query);
	if (validQuery === false) {
		console.log(`Invalid query (${query}) => redirecting to '#Menu'`);
		newState = 'Menu';
		page = 'Menu';
		query = '';
	}

	const currentState = sessionStorage.getItem("currentState");
	console.log('BEFORE state', newState, currentState);
	const validState = getValidState(page, currentState ? currentState : '');
	console.log('AFTER state', validState, currentState);
	const fullHash = query != '' ? `#${validState}?${query}` : `#${validState}`;

	const pagesWithQuery = ['Dashboard', 'GameStats'];
	if (pagesWithQuery.includes(validState)) {
		history.replaceState({ page: validState, query }, '', fullHash);
	}
	else
		history.replaceState({ page: validState, query: null }, '', `#${validState}`);

	// Always go back to menu and stop game
	if (currentState === 'Game' && validState !== 'Game') {
		cancelOnlineMatch();
		stopCurrentGame();
		navigateTo('Menu', false);
		return ;
	}

	if (validState) {
		renderPage(validState, query, false);
	} else {
		renderPage('Menu', '', false); // fallback
	}
}
