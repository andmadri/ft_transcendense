import { handleOnlineMatch, removeFromWaitinglist } from "./onlinematch.js";
import { addUserToRoom } from "../rooms.js";
import { createMatch, matches } from "../InitGame/match.js";
import { OT, state } from '../SharedBuild/enums.js'
import { getUserByID } from "../Database/users.js";
import { matchInterval } from "./onlinematch.js";

// STEP 2: receiving invitation and send back to all the online players.
async function challengeFriend(db, socket, challenger, responder) {
	const tempMatchID = 'temp' + challenger + '+' + responder;
	// send to everyone in main except the current user socket
	addUserToRoom(socket, tempMatchID);
	const user = await getUserByID(db, challenger);
	if (!user)
		return;

	socket.to('main').emit('message', {
		action: 'matchmaking',
		subaction: 'challengeFriend',
		challenger,
		responder,
		requester_name: user.name,
		id: tempMatchID
	});
}

function changeUsersToOtherRoom(io, oldRoom, newRoom) {
	const sockets = io.sockets.adapter.rooms.get(oldRoom);
	if (!sockets)
		return;

	for (const socketId of sockets) {
		const socket = io.sockets.sockets.get(socketId);
		if (socket) {
			socket.leave(oldRoom);
			addUserToRoom(socket, newRoom);
		}
	}
}

// STEP 5: receive response from responder
async function receiveResponseChallenge(io, db, socket, msg) {
	const responseChallenge = {
		action: 'matchmaking',
		subaction: 'responseChallenge',
		challenger: msg.challenger,
		responder: msg.responder,
		response: true
	}
	addUserToRoom(socket, msg.tempMatchID);
	if (msg.answer == true) {
		const matchID = await createMatch(db, OT.Online, socket, msg.challenger, msg.responder);
		changeUsersToOtherRoom(io, msg.tempMatchID, matchID);
		const match = matches.get(matchID);
		if (!match) {
			console.log(`Something went wrong!!! No match for matchID: ${matchID}`);
			return ;
		}
		io.to(matchID).emit('message', {
			action: 'initOnlineGame',
			matchID: matchID,
			match: match
		});
		match.state = state.Init;
		matchInterval(match, io);
	} else {
		responseChallenge.response = false;
		socket.to(msg.tempMatchID).emit('message', responseChallenge);
		socket.leave(msg.roomname);
	}
}

export function handleMatchmaking(db, msg, socket, userID, io) {
	if (!msg.subaction)
		return ;
	
	console.log(`handlematchmaking() -> UserID = ${userID}`);
	switch(msg.subaction) {
		case 'challengeFriend':
			challengeFriend(db, socket, msg.challenger, msg.responder);
			break ;
		case 'challengeFriendAnswer':
			receiveResponseChallenge(io, db, socket, msg);
			break ;
		case 'createOnlineMatch':
			handleOnlineMatch(db, socket, userID, io);
			break ;
		case 'cancelOnlineMatch':
			removeFromWaitinglist(userID);
			break ;
		default:
			console.log(`subaction ${msg.subaction} not found in handleMatchmaking`);
	}
}