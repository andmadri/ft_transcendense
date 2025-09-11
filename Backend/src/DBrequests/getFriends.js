import * as friendsDB from '../Database/friends.js';
import { getAllPlayerInclFriends } from './getPlayers.js';
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content) {
	socket.emit('message', {
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content,
		playerNr: 1
	});
}

async function addFriendRequest(socket, userId1, data) {
	try {
		await friendsDB.addFriendRequestDB(db, userId1, data.friendID);
	} catch (err) {
		sendContentToFrontend('friends', 'error', socket, 'no', err.message);
	}
}

async function acceptFriendRequest(socket, data) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		sendContentToFrontend('friends', 'error', socket, 'no', err.message);
	}
}

async function denyFriendRequest(socket, userID1, data) {
	try {
		await friendsDB.denyFriendRequestDB(db, data.requestId);
	} catch (err) {
		sendContentToFrontend('friends', 'error', socket, 'no', err.message);
	}
}

async function deleteFriendship(socket, userID1, msg) {
	try {
		await friendsDB.deleteFriendDB(db, userID1, msg.friendID);
	} catch (err) {
		sendContentToFrontend('friends', 'error', socket, 'no', err.message);
	}
}

export async function getFriends(userId1, socket) {
	try {
		const friends = await friendsDB.getFriendsDB(db, userId1);
		if (!friends || friends.length === 0) {
			sendContentToFrontend('friends', 'retFriends', socket, 'no', 'No friends found');
		} else {
			sendContentToFrontend('friends', 'retFriends', socket, 'yes', friends);
		}
	} catch (err) {
		sendContentToFrontend('error', '', socket, 'no', err.message);
	}
}

export async function openFriendRequest(userId1, socket) {
	try {
		const requests = await friendsDB.getOpenFriendRequestsDB(db, userId1);
		if (requests || requests.length !== 0) {
			sendContentToFrontend('friends', 'openRequests', socket, 'yes', requests);
		}
	} catch (err) {
		sendContentToFrontend('error', '', socket, 'no', 'Error while fetching open requests');
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
		case 'openFriendRequests':
			openFriendRequest(userId1, socket);
			break ;
		case 'acceptFriendRequest':
			acceptFriendRequest(socket, msg);
			break ;
		case 'denyFriendRequest':
			denyFriendRequest(socket, userId1, msg);
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
