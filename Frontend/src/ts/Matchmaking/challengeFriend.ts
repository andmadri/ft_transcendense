import * as S from '../structs.js'
import { Game, UI } from "../gameData.js"
import { log } from "../logging.js";
import { navigateTo } from '../history.js';
import { customAlert } from '../Alerts/customAlert.js';


// STEP 1: after push button invite friend..
export function inviteFriendForGame(responder: string) {
	Game.socket.emit('message', {
		action: 'matchmaking',
		subaction: 'challengeFriend',
		challenger: UI.user1.ID,
		responder: responder,
	});
}

// STEP: 4: send back response to server
export function responseChallenge(answer: boolean, req: any) {
	if (answer == true) {
		navigateTo('Pending');
		Game.pendingState = S.pendingState.Friend;
	}
	Game.socket.emit('message', {
		action: 'matchmaking',
		subaction: 'challengeFriendAnswer',
		answer: answer,
		tempMatchID: req.id,
		responder: UI.user1.ID,
		challenger: req.challenger,
	});
}

function challengeDeclined() {
	customAlert('Your invitation is denied'); //needed customAlert
	navigateTo('Menu', false);
}

function msgMatchIsRemoved() {
	customAlert('This challenge is removed'); //needed customAlert
	navigateTo('Menu', false);
}

export function actionMatchmaking(msg: any) {
	if (!msg || !msg.subaction)
		return console.error('MSG_MISSING_SUBACTION', 'Invalid message format', 'missing subaction', msg, 'actionMatchmaking');

	switch (msg.subaction) {
		case 'challengeDeclined':
			challengeDeclined();
			break;
		case 'matchIsRemoved':
			msgMatchIsRemoved();
			break;
		default:
			console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', msg.subaction, 'actionMatchmaking');
	}
}