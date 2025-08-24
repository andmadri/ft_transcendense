import { Game, UI } from './gameData';
import { showCreditsPage } from './Menu/credits';
import * as S from './structs.js'
import { state } from '@shared/enums'

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
export let currentState: string = 'LoginP1';

export function renderPage(state: string) {
	switch (state) {
		case 'LoginP1':
			UI.state = S.stateUI.LoginP1;
			break ;
		case 'LoginP2':
			UI.state = S.stateUI.LoginP2;
			break;
		case 'Menu':
			document.getElementById("creditDiv")?.remove();
			UI.state = S.stateUI.Menu;
			break ;
		case 'Stats':
			// showStatsPage();
			break ;
		case 'Credits':
			showCreditsPage();
			break ;
		case 'Settings':
			// showSettingsPage();
			break ;
		case 'Game':
			UI.state = S.stateUI.Game;
			break ;
		default:
			console.log(`Page does not exist: ${state}`);
			UI.state = S.stateUI.Menu;
	}
	currentState = state;
}

/**
 * Saves current state in history and navigates to page
 * @param page UI.stateUI as string
 * @param subState Game.match.state as string
 * @param gameData Extra information if needed
 */
export function navigateTo(state: string) {
	console.log(`Save navigation to: ${state}`);
	
	if (history.state === state)
    	renderPage(state);
	else {
		history.pushState(state, '', `#${state}`);
		renderPage(state);
	}
}

function cancelOnlineMatch() {
	Game.socket.send({ 
		action: 'matchmaking',
		subaction: 'cancelOnlineMatch',
		matchID: Game.match.ID
	});
}

function stopCurrentGame() {
	Game.socket.send( { 
		action: 'game',
		subaction: 'quit',
		matchID: Game.match.ID,
		player: Game.match.player1.ID,
		name: Game.match.player1.name
	});
}

function getValidState(state: string): string {
	// Is already logged in
    if (state != 'LoginP1' && Game.match.player1.ID == -1)
		return ('Menu');

	// No match is started
    if (state === 'Game' && Game.match.matchID == -1)
		return ('Menu');

	// When logged in not back to loginpage	
	if (currentState == 'Menu' && state == 'LoginP1')
		return ('Menu');

	if (currentState == 'Menu' && state == 'Game')
		return ('Menu');

    const allowedPages = ['Menu', 'Game', 'Credits', 'LoginP1', 'LoginP2',
		'Stats', 'Settings'];
	for (const page of allowedPages) {
		if (page == state)
			return (state);
	}
    return ('Menu');
}

export function controlBackAndForward(event: PopStateEvent) {
	const state = event.state as string;

	console.log(`Btn pushed: Current: ${currentState} and state: ${state}`);
	
	const validState = getValidState(state);
	history.replaceState(validState, '', `#${validState}`);

	if (currentState == 'Game' && validState == 'Menu') {
			cancelOnlineMatch();
			stopCurrentGame();
			renderPage('Menu'); // Always go back to menu
			return ;
	}

	console.log(`renderPage: ${validState}`);

	if (validState) {
		renderPage(validState);
	} else {
		renderPage('Menu'); // fallback
	}
}
