import { Game, UI } from "../gameData.js";
import { navigateTo } from "../history.js";
import { updateNameTagsTournament, showTournamentEndScreen } from './tournamentDisplay.js';
import { customAlert } from '../Alerts/customAlert.js';

export function actionTournament(data: any) {
	if (data.subaction === 'update') {
		tournamentUpdate(data);
	} else if (data.subaction === 'left') {
		navigateTo('Menu');
	} else if (data.subaction === 'joinRejected') {
		customAlert('Tournament join rejected: ' + (data.reason || 'Unknown reason'));
		navigateTo('Menu');
	} else if (data.subaction === 'error') {
		tournamentError;
	}
}

function tournamentUpdate(data: any) {
	console.log('Tournament update:', data);
	console.log('Tournament update received: ' + JSON.stringify(data.tournamentState));
	if (data.tournamentState.state === 'finished')
		showTournamentEndScreen(data.tournamentState);
	setTimeout(() => {
		updateNameTagsTournament(data.tournamentState);
	}, 500);
}

function tournamentError(data: any) {
	console.error('TOURNAMENT_ERROR', data.reason || 'Unknown error', 'tournamentError');
	navigateTo('Menu');
}

export function readyTournamentPlayer() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'ready',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
}

export function notReadyTournamentPlayer() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'notReady',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
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

export function requestJoinTournament() {
	Game.socket.emit('message', {
		action: 'tournament',
		subaction: 'join',
		name: UI.user1.name,
		userId: UI.user1.ID
	});
	navigateTo('Tournament');
}
