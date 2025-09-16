import * as S from '../structs.js'
import { Game, UI } from "../gameData.js"
import { log } from "../logging.js";
import { navigateTo } from '../history.js';

// STEP 1: after push button invite friend..
export function inviteFriendForGame(responder: string) {
	Game.socket.emit('message',{
		action: 'matchmaking',
		subaction: 'challengeFriend',
		challenger: UI.user1.ID,
		responder: responder,
	});
}

// STEP: 4: send back response to server
export function responseChallenge(answer: boolean, req: any) {
	if (answer == true) {
		UI.state = S.stateUI.Game;
		navigateTo('Pending');
	}
	Game.socket.emit('message',{
		action: 'matchmaking',
		subaction: 'challengeFriendAnswer',
		answer: answer,
		tempMatchID: req.id,
		responder: UI.user1.ID,
		challenger: req.challenger,
	});
}

function challengeDeclined() {
	alert('Your invitation is denied');
	navigateTo('Menu', false);
}

export function actionMatchmaking(msg: any) {
	if (!msg.subaction)
		return ;

	switch(msg.subaction) {
		case 'challengeDeclined':
			challengeDeclined();
			break ;
		default:
			log(`subaction ${msg.subaction} not found in handleMatchmaking`);
	}
}