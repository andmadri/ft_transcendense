import { handleOnlineMatch, removeFromWaitinglist } from "./onlinematch.js";
import { addUserToRoom } from "../rooms.js";
import { createMatch, matches } from "../InitGame/match.js";
import { OT, state } from '../SharedBuild/enums.js'
import { getUserByID } from "../Database/users.js";
import { matchInterval } from "./onlinematch.js";
import { leaveRoom } from "../rooms.js";

let friendInvites = new Map();

// Checks if a player disconnect if there are open invites
export function checkChallengeFriendsInvites(socket, userId1) {
	let invite = null;
	for (const data of friendInvites.values()) {
		invite = data.invite;
		if (invite.challenger === userId1)
			break ;
		invite = null;
	}
	if (invite)
		friendInvites.delete(invite.id);
}

// Returns al the invites
export function getChallengesFriends(responder) {
	let invites = [];

	for (const data of friendInvites.values()) {
		const invite = data.invite;
		if (invite.responder === responder)
			invites.push(invite);
	}
	return (invites);
}

async function challengeFriend(io, db, socket, challenger, responder) {
	const tempMatchID = 'temp' + challenger + '+' + responder;
	const reverseMatchID = 'temp' + responder + '+' + challenger;

	if (friendInvites.has(tempMatchID))
		return ;

	if (friendInvites.has(reverseMatchID))
	{
		const socket2 = friendInvites.get(reverseMatchID).socket;
		startChallenge(io, db, socket, {challenger, responder, tempMatchID: reverseMatchID, socket2});
		return ;
	}

	let user = null;
	try {
		user = await getUserByID(db, challenger);
		if (!user) {
			console.error('PLAYER_NOT_FOUND Error getUserByID', 'challengeFriend');
			return ;
		}
	} catch (err) {
		console.error('PLAYER_NOT_FOUND Error getUserByID', err.message || err, 'challengeFriend');
		return ;
	}

	friendInvites.set(tempMatchID, {socket, invite :{challenger, responder, requester_name: user.name, id: tempMatchID}});
}

async function startChallenge(io, db, socket, msg) {
	const data = friendInvites.get(msg.tempMatchID || msg.id);
	if (!data) {
		socket.emit('message', {action: 'matchmaking', subaction: 'matchIsRemoved'});
		return ;
	}
	const socket2 = data.socket;
	if (!socket2)
		return console.error('CHALLENGE_NO_SOCKET socket is not found', 'startChallenge');

	if (!socket2.connected) {
		console.error('CHALLENGE_SOCKET_DISCONNECTED Responder is disconnected', 'startChallenge');
		stopChallenge(msg, true);
		return ;
	}

	const matchID = await createMatch(db, OT.Online, socket, msg.challenger, msg.responder);
	if (matchID === -1) {
		console.error(`CHALLENGE_MATCH_CREATION_FAIL Error in createMatch`, 'startChallenge');
		return ;
	}
	addUserToRoom(socket2, matchID);
	addUserToRoom(socket, matchID);

	const match = matches.get(matchID);
	if (!match) {
		console.error(`MATCH_NOT_FOUND No match for matchID: ${matchID}`, 'startChallenge');
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
}

function stopChallenge(msg, disconnectedSocket) {
	if (!disconnectedSocket) {
		const data = friendInvites.get(msg.tempMatchID);
		if (!data) {
			return ;
		}
		const socket = data.socket;
		if (!socket)
			return console.error('CHALLENGE_NO_SOCKET socket is not found', 'stopChallenge');

		socket.emit('message', {
			action: 'matchmaking',
			subaction: 'challengeDeclined'
		})
		leaveRoom(socket, msg.tempMatchID);
	}
	friendInvites.delete(msg.tempMatchID);
}

function cancelChallengeFriend(socket, userID) {
	let invite = null;
	for (const data of friendInvites.values()) {
		invite = data.invite;
		if (invite.challenger == userID)
			break ;
		invite = null
	}
	if (invite)
		friendInvites.delete(invite.id);
}

async function receiveResponseChallenge(io, db, socket, msg) {
	if (msg.answer == true)
		startChallenge(io, db, socket, msg);
	else
		stopChallenge(msg, false);
}

export function handleMatchmaking(db, msg, socket, userID, io) {
	if (!msg.subaction)
		return handleError('MSG_MISSING_SUBACTION', 'Invalid message format', 'missing subaction', msg, 'handleMatchmaking');
	
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
		case 'cancelChallengeFriend':
			cancelChallengeFriend(socket, userID);
			break ;
		case 'cancelOnlineMatch':
			removeFromWaitinglist(userID);
			break ;
		default:
			handleError(socket, 'MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', msg.subaction, 'handleMatchmaking');
	}
}