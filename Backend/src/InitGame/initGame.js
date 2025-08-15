import { createMatch } from "./match.js";

function sendStartMsgToPlayers(roomID) {
	console.log("both players are ready to play! START");
	io.to(roomID).emit('message', {
		action: 'game',
		subaction: 'start',
	});
}

/**
 * @brief checks waitinglist. 
 * @returns true if nobody is waiting, else false
 */
function handleStartOnlineMatch(msg, match) {
	if (msg.userID == match.player1.id)
		match.player1.ready = true;
	else if (msg.userID == match.player2.id)
		match.player2.ready = true;
	console.log(`Player ${msg.userID} is ready..`);

	if (match.player1.ready && match.player2.ready) {
		sendStartMsgToPlayers(match.roomID);
	} else {
		console.log("waiting till the opponent is ready");
		return true;
	}
	return false
}

export function handleInitGame(msg, socket, userId1, userId2) {
	if (!msg.subaction)
		return console.log('no subaction in handleInitGame');

	if (msg.subaction == 'createMatch' && msg.opponentMode != 3)
		return createMatch(msg, socket, userId1, userId2);

	if (msg.subaction == 'start') {
		if (handleStartOnlineMatch(msg, match))
			return ;
	}
	
}