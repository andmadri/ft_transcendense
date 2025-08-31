import { Game, UI } from './gameData.js';
import { cancelOnlineMatch } from './Matchmaking/onlineMatch.js';
import * as S from './structs.js'
import { state } from '@shared/enums'
import { getGameOver } from './Game/endGame.js';

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

/**
 * @brief change state or shows new page
 * @param state new state
 */
export function renderPage(newState: string) {
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
			getGameOver();
			break ;
		default:
			console.log(`Page does not exist: ${newState}`);
			UI.state = S.stateUI.Menu;
	}
	sessionStorage.setItem("currentState", newState);
}

/**
 * @brief Saves current state in history and navigates to page
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 */
export function navigateTo(state: string) {
	console.log(`Save navigation to: ${state}`);

	// save last page for when refresh page
	sessionStorage.setItem('history', state);
	
	if (history.state === state)
    	renderPage(state);
	else {
		history.pushState(state, '', `#${state}`);
		renderPage(state);
	}
}

function stopCurrentGame() {
	Game.socket.emit('message', { 
		action: 'game',
		subaction: 'quit',
		matchID: Game.match.ID,
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
    if (state != 'LoginP1' && UI.user1.ID == -1)
		return ('Menu');

	// No match is started
    if ((state === 'Game' || state === 'GameOver') && Game.match.matchID == -1)
		return ('Menu');

	// When logged in not back to loginpage	
	if (currentState == 'Menu' && state == 'LoginP1')
		return ('Menu');

	if (currentState == 'Menu' && (state === 'Game' || state === 'GameOver'))
		return ('Menu');

    const allowedPages = ['Menu', 'Game', 'Credits', 'LoginP1', 'LoginP2',
		'Settings', 'Dashboard'];
	for (const page of allowedPages) {
		if (page == state)
			return (state);
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
	history.replaceState(validState, '', `#${validState}`);

	console.log(`State: ${state} -> validState: ${validState}, currentState: ${currentState}`)
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
