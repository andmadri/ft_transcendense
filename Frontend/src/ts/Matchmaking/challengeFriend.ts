import { Game, UI } from "../gameData.js"
import { log } from "../logging.js";

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
function responseChallenge(answer: boolean, roomname: string) {
	Game.socket.emit('message',{
		action: 'matchmaking',
		subaction: 'challengeFriendAnswer',
		answer: answer,
		roomname: roomname, 
		responder: UI.user1.ID
	});
}

// STEP 3: create popup on screen responder that has accept of deny buttons
export function acceptOnlineChallenge(msg: any) {
	if (!isChallenged(msg.friendID))
		return ; // msg not for me

	alert(`${msg.challenger} is challenge you`);
	// create popup with USERNAME is challenging YOU...
	const btnAccept = document.createElement('button');
	const btnDeny = document.createElement('button');
	btnAccept.addEventListener('click', () => {
		responseChallenge(true, msg.roomname);
	})
	btnDeny.addEventListener('click', () => {
		responseChallenge(false, msg.roomname);
	})
}

// STEP 6: receive answer from responder
export function receiveAnswerResponder(msg: any) {
	if (msg.response == true) {
		alert("Challenge is accepted");
	} else {
		alert("Challenge is denied");
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