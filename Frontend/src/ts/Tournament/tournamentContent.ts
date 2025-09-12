import { Game, UI } from "../gameData.js"
import { navigateTo } from "../history.js";
import { showTournamentScreen } from './tournamentDisplay.js';
import { tournamentGameStart } from "./tournamentGameStart.js";
import { createLog, log } from '../logging.js'

export function actionTournament (data: any) {
	if  (data.subaction === 'update') {
		tournamentUpdate(data);
	} else if (data.subaction === 'gameStart') {
		tournamentGameStart(data);
	} else if (data.subaction === 'result') {
		tournamentResult(data);
	} else if (data.subaction === 'left') {
		navigateTo('Menu');
	} else if (data.subaction === 'joinRejected') {
		alert('Tournament join rejected: ' + (data.reason || 'Unknown reason'));
		navigateTo('Menu');
	} else if (data.subaction === 'error') {
		tournamentError;
	}
}

function tournamentUpdate(data: any) {
	console.log('Tournament update:', data);
	document.getElementById('tournamentScreen')?.remove();
	log('Tournament update received: ' + JSON.stringify(data.tournamentState));
	showTournamentScreen(data.tournamentState);
}

function tournamentResult(data: any) {
	tournamentUpdate(data);
	alert('Tournament result: ' + JSON.stringify(data));
	
}

function tournamentError(data: any) {
	alert('Tournament error: ' + (data.reason || 'Unknown error'));
	navigateTo('Menu');
}

export function requestUpdateTournament() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'getState',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
}

export function requestLeaveTournament() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'leave',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
}

export function joinTournament() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'join',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
	navigateTo('Tournament');
}