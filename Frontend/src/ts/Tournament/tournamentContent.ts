import { Game, UI } from "../gameData.js"
import { navigateTo } from "../history.js";
import { showTournamentScreen } from './tournamentDisplay.js';

export function actionTournament (data: any) {
	if  (data.subaction === 'update') {
		tournamentUpdate(data);
	} else if (data.subaction === 'gameStart') {
		tournamentGameStart(data);
	} else if (data.subaction === 'result') {
		tournamentResult(data);
	}
}

function tournamentUpdate(data: any) {
	console.log('Tournament update:', data);
	document.getElementById('tournamentScreen')?.remove();
	showTournamentScreen(data.tournamentState);
}

function tournamentGameStart(data: any) {
	alert('Your tournament match is starting!');
	// TODO: Show match info, transition to game, etc.
}

function tournamentResult(data: any) {
	alert('Tournament result: ' + JSON.stringify(data));
	// TODO: Show results, update bracket, etc.
}

export function joinTournament() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'join',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
	navigateTo('Tournament');

	// Request the current tournament state from backend
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'getState'
	});
}
