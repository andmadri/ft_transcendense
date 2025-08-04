import { handleOnlineMatch } from "./onlinematch.js";

export function addUserToRoom(socket, roomname) {
	console.log(`Added User to ${roomname}`);
	socket.join(roomname);
}

// STEP 2: receiving invitation and send back to all the online players.
function challengeFriend(socket, challenger, responder) {
	const msg = {
		action: 'matchmaking',
		subaction: 'challengeFriend',
		challenger: userID,
		responder: friendID,
		roomname: challenger + responder
	}

	// send to everyone in main except the current user socket
	addUserToRoom(socket, challenger + responder);
	socket.to('main').emit(JSON.stringify(msg));
}

// STEP 5: receive response from responder
function receiveResponseChallenge(socket, msg) {
	const responseChallenge = {
		action: 'matchmaking',
		subaction: 'responseChallenge',
		response: true
	}
	if (msg.answer == true) {
		socket.to(msg.roomname).emit('matchmaking', responseChallenge);
		addUserToRoom(socket, msg.roomname);
		// start match?
	} else {
		responseChallenge.response = false;
		socket.to(msg.roomname).emit('matchmaking', responseChallenge);
		socket.leave(msg.roomname);
	}
}

export function handleMatchmaking(msg, socket, userID, io) {
	if (!msg.subaction)
		return ;

	switch(msg.subaction) {
		case 'challengeFriend':
			challengeFriend(socket, msg.challenger, msg.responder);
			break ;
		case 'challengeFriendAnswer':
			receiveResponseChallenge(socket, msg);
			break ;
		case 'createOnlineMatch':
			handleOnlineMatch(socket, userID, io);
			break ;
		default:
			console.log(`subaction ${msg.subaction} not found in handleMatchmaking`);
		
	}

}