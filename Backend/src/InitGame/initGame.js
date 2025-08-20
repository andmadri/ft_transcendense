import { createMatch } from "./match.js";

// To frontend: players get msg that server is ready with init, game can start
function sendStartMsgToPlayers(matchID) {
	console.log("both players are ready to play! START");
	io.to(matchID).emit('message', {
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
		sendStartMsgToPlayers(match.matchID);
	} else {
		console.log("waiting till the opponent is ready");
		return true;
	}
	return false
}

// From Frontend
export function handleInitGame(db, msg, socket, userId1, userId2) {
	if (!msg.subaction)
		return console.log('no subaction in handleInitGame');

	// for local games
	if (msg.subaction == 'createMatch' && msg.mode != 3)
		return createMatch(db, msg.mode, socket, userId1, userId2);

	// receive msg that frontend is ready to play (online match)
	if (msg.subaction == 'start') {
		if (handleStartOnlineMatch(msg, match))
			return ;
	}
	
}