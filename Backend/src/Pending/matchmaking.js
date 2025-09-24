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

// STEP 2: receiving invitation and send back to all the online players.
async function challengeFriend(io, db, socket, challenger, responder) {
	const tempMatchID = 'temp' + challenger + '+' + responder;
	const reverseMatchID = 'temp' + responder + '+' + challenger;

	if (friendInvites.has(tempMatchID))
		return ;

	if (friendInvites.has(reverseMatchID))
	{
		console.log("reverse match..");
		const socket2 = friendInvites.get(reverseMatchID).socket;
		startChallenge(io, db, socket, {challenger, responder, tempMatchID: reverseMatchID, socket2});
		return ;
	}

	let user = null;
	try {
		user = await getUserByID(db, challenger);
		if (!user) {
			console.log('Error getUserByID', err);
			return ;
		}
	} catch (err) {
		console.log('Error getUserByID', err);
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
		return console.error('Start challenge: socket is not found');

	if (!socket2.connected) {
		stopChallenge(msg, true);
		return ;
	}

	const matchID = await createMatch(db, OT.Online, socket, msg.challenger, msg.responder);
	if (matchID === -1) {
		console.log(`startChallenge - Error in createMatch`);
		return ;
	}
	addUserToRoom(socket2, matchID);
	addUserToRoom(socket, matchID);

	const match = matches.get(matchID);
	if (!match) {
		console.log(`No match for matchID: ${matchID}`);
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
			return console.error('stopChallenge: socket is not found');

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

// STEP 5: receive response from responder
async function receiveResponseChallenge(io, db, socket, msg) {
	if (msg.answer == true)
		startChallenge(io, db, socket, msg);
	else
		stopChallenge(msg, false);
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
		case 'cancelChallengeFriend':
			cancelChallengeFriend(socket, userID);
			break ;
		case 'cancelOnlineMatch':
			removeFromWaitinglist(userID);
			break ;
		default:
			console.error(`subaction ${msg.subaction} not found in handleMatchmaking`);
	}
}