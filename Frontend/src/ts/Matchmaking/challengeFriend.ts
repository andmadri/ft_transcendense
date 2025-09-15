import { Game, UI } from "../gameData.js"
import { log } from "../logging.js";
import * as S from '../structs.js' 
import { state } from '@shared/enums'

export let friendInvites: Map<string, any> = new Map();

// STEP 1: after push button invite friend..
export function inviteFriendForGame(responder: string) {
	Game.socket.emit('message',{
		action: 'matchmaking',
		subaction: 'challengeFriend',
		challenger: UI.user1.ID,
		responder: responder,
	});
}

function isChallenged(ID: number): boolean {
	if (ID == UI.user1.ID)
		return (true);
	return (false);
}

// STEP: 4: send back response to server
export function responseChallenge(answer: boolean, req: any) {
	if (answer == true) {
		UI.state = S.stateUI.Game;
		Game.match.state = state.Pending;
	}
	Game.socket.emit('message',{
		action: 'matchmaking',
		subaction: 'challengeFriendAnswer',
		answer: answer,
		tempMatchID: req.id,
		responder: UI.user1.ID,
		challenger: req.challenger
	});
	friendInvites.delete(req.id);
}

// STEP 3: create popup on screen responder that has accept of deny buttons
export function acceptOnlineChallenge(msg: any) {
	console.log("You are challenged by " + msg.requester_name);
	if (!isChallenged(msg.responder))
		return ; // msg not for me

	console.log("Add to friendInvites array");
	friendInvites.set(msg.responder, msg);
}

// STEP 6: receive answer from responder
export function receiveAnswerResponder(msg: any) {
	if (msg.response == true) {
		// nothing?
	} else {
		alert("Challenge is denied");
		if (msg.challenger == UI.user1.ID) {
			friendInvites.delete(msg.responder);
		}
	}
}

export function actionMatchmaking(msg: any) {
	if (!msg.subaction)
		return ;

	switch(msg.subaction) {
		case 'challengeFriend':
			acceptOnlineChallenge(msg);
			break ;
		case 'responseChallenge':
			receiveAnswerResponder(msg);
			break ;
		default:
			log(`subaction ${msg.subaction} not found in handleMatchmaking`);
	}
}