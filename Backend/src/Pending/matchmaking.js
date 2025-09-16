import { handleOnlineMatch, removeFromWaitinglist } from "./onlinematch.js";
import { addUserToRoom } from "../rooms.js";
import { createMatch, matches } from "../InitGame/match.js";
import { OT, state } from '../SharedBuild/enums.js'
import { getUserByID } from "../Database/users.js";
import { matchInterval } from "./onlinematch.js";
import { start } from "repl";

export let friendInvites = new Map();
export let invitesToSocket = new Map(); // seperate so you don't send sockets to the frontend ( stack overflow )

export function getChallengesFriends(responder) {
	let invites = [];

	for (const invite of friendInvites.values()) {
		if (invite.responder === responder)
			invites.push(invite);
	}
	return (invites);
}

// STEP 2: receiving invitation and send back to all the online players.
async function challengeFriend(io, db, socket, challenger, responder) {
	const tempMatchID = 'temp' + challenger + '+' + responder;
	const reverseMatchID = 'temp' + responder + '+' + challenger;

	if (friendInvites.has(tempMatchID))
		return ;

	if (friendInvites.has(reverseMatchID) && invitesToSocket.has(reverseMatchID))
	{
		console.log("reverse match..");
		const socket2 = invitesToSocket.get(reverseMatchID).socket;
		startChallenge(io, db, socket, {challenger, responder, tempMatchID: reverseMatchID, socket2});
		return ;
	}
	const user = await getUserByID(db, challenger);
	if (!user)
		return;

	friendInvites.set(tempMatchID, {challenger, responder, requester_name: user.name, id: tempMatchID})
	invitesToSocket.set(tempMatchID, socket );
}

async function startChallenge(io, db, socket, msg) {
	const socket2 = invitesToSocket.get(msg.tempMatchID);
	if (!socket2)
		return console.error('Start challenge: socket is not found');

	const matchID = await createMatch(db, OT.Online, socket, msg.challenger, msg.responder);
	addUserToRoom(socket2, matchID);
	addUserToRoom(socket, matchID);

	const match = matches.get(matchID);
	if (!match) {
		console.error(`Something went wrong!!! No match for matchID: ${matchID}`);
		return ;
	}
	io.to(matchID).emit('message', {
		action: 'initOnlineGame',
		matchID: matchID,
		match: match
	});
	match.state = state.Init;
	matchInterval(match, io);
	friendInvites.delete(msg.tempMatchID);
	invitesToSocket.delete(msg.tempMatchID);
}

function stopChallenge(msg) {
	console.log('stop challenge: ', msg);
	const socket = invitesToSocket.get(msg.tempMatchID);
	if (!socket)
		return console.error('stopChallengee: socket is not found');

	socket.emit('message', {
		action: 'matchmaking',
		subaction: 'challengeDeclined'
	})
	socket.leave(msg.tempMatchID);
	friendInvites.delete(msg.tempMatchID);
	invitesToSocket.delete(msg.tempMatchID);
}

// STEP 5: receive response from responder
async function receiveResponseChallenge(io, db, socket, msg) {
	if (msg.answer == true)
		startChallenge(io, db, socket, msg);
	else
		stopChallenge(msg);
}

export function handleMatchmaking(db, msg, socket, userID, io) {
	if (!msg.subaction)
		return ;
	
	switch(msg.subaction) {
		case 'challengeFriend':
			challengeFriend(io, db, socket, msg.challenger, msg.responder);
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
			console.error(`subaction ${msg.subaction} not found in handleMatchmaking`);
	}
}