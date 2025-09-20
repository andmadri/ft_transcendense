import * as friendsDB from '../Database/friends.js';
import { getAllPlayerInclFriends } from './getPlayers.js';
import { getChallengesFriends } from '../Pending/matchmaking.js';
import { db } from '../index.js';

function sendContentToFrontend(socket, actionable, sub, content) {
	socket.emit('message', {
		action: actionable,
		subaction: sub,
		content: content,
	});
}

async function addFriendRequest(socket, userId1, data) {
	try {
		await friendsDB.addFriendRequestDB(db, userId1, data.friendID);
	} catch (err) {
		sendContentToFrontend(socket, 'friends', 'error', err.message);
	}
}

async function acceptFriendRequest(socket, data) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		sendContentToFrontend(socket, 'friends', 'error', err.message);
	}
}

async function denyFriendRequest(socket, data) {
	try {
		await friendsDB.denyFriendRequestDB(db, data.requestId);
	} catch (err) {
		sendContentToFrontend(socket, 'friends', 'error', err.message);
	}
}

async function deleteFriendship(socket, userID1, msg) {
	try {
		await friendsDB.deleteFriendDB(db, userID1, msg.friendID);
	} catch (err) {
		sendContentToFrontend(socket, 'friends', 'error', err.message);
	}
}

export async function getFriends(userId1, socket) {
	try {
		const friends = await friendsDB.getFriendsDB(db, userId1);
		if (friends || friends.length !== 0) {
			sendContentToFrontend(socket, 'friends', 'retFriends', friends);
		}
	} catch (err) {
		sendContentToFrontend(socket, 'friends', 'error', err.message);
	}
}

export async function openFriendRequest(userId1, socket) {
	try {
		const requests = await friendsDB.getOpenFriendRequestsDB(db, userId1);
		const invites = getChallengesFriends(userId1);

		socket.emit('message', {
		action: 'friends',
		subaction: 'openRequests',
		friendRequests: requests ? requests : null,
		invites: invites ? invites : null
	});

	} catch (err) {
		sendContentToFrontend(socket, 'friends', 'error', err.message);
	}
}

export async function handleFriends(msg, socket, userId1) {
	switch (msg.subaction) {
		case 'getFriends':
			getFriends(userId1, socket);
			break ;
		case 'friendRequest':
			addFriendRequest(socket, userId1, msg);
			break ;
		case 'acceptFriendRequest':
			acceptFriendRequest(socket, msg);
			break ;
		case 'denyFriendRequest':
			denyFriendRequest(socket, msg);
			break ;
		case 'unfriend':
			deleteFriendship(socket, userId1, msg);
			break ;
		case 'initMenu':
			openFriendRequest(userId1, socket);
			getFriends(userId1, socket);
			getAllPlayerInclFriends(db, userId1, socket);
			break ;
		default:
			console.log(`Unknown subaction ${msg.subaction}`);
			sendContentToFrontend('error', '', socket, 'no', 'Unkown action');
	}
}
