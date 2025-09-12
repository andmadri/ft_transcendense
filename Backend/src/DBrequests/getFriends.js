import * as friendsDB from '../Database/friends.js';
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

async function acceptFriendRequest(socket, data) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		if (err.message.includes('No pending')) {
			sendContentToFrontend('friends', 'error', socket, 'no', err.message);
		} else {
			socket.emit('message', {action: 'error', msg: 'Database error'});
			console.error(err);			
		}
	}
}

async function denyFriendRequest(socket, userID1, data) {
	try {
		friendsDB.deleteFriendDBfromID(db, data.requestId);
	} catch (err) {
		if (err.message.includes('No pending')) {
			sendContentToFrontend('friends', 'error', socket, 'no', err.message);
		} else {
			socket.emit('message', {action: 'error', msg: 'Database error'});
			console.error(err);			
		}
	}
}

export async function getFriends(userId1, socket) {
	try {
		const friends = await friendsDB.getFriendsDB(db, userId1);
		if (!friends || friends.length === 0) {
			return sendContentToFrontend('friends', 'retFriends', socket, "no", "No friends found");
		}
		return sendContentToFrontend('friends', 'retFriends', socket, "yes", friends);
	} catch (err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while requesting friends");
	}
}

export async function openFriendRequest(userId1, socket) {
	try {
		const requests = await friendsDB.getOpenFriendRequestsDB(db, userId1);
		if (!requests || requests.length === 0) {
			// console.log("no open requests");
			return ;
		}
		sendContentToFrontend('friends', 'openRequests', socket, "yes", requests);
	} catch (err) {
		console.error("DB error: ", err);
		sendContentToFrontend('error', '', socket, "no", "Error while fetching open requests");
	}
}

export async function addFriendRequest(socket, userId1, data) {
	try {
		await friendsDB.addFriendRequestDB(db, userId1, data.friendID);
	} catch (err) {
		if (err.message.includes('You already invited this player')) {
			sendContentToFrontend('friends', 'error', socket, "no", err.message);
		} else {
			socket.emit('message', {action: '', subaction: '', msg: 'Database error'});
			console.error(err);
		}
	}
}

async function deleteFriendship(socket, userID1, msg) {
	try {
		console.log("Want to delete: ", userID1, msg.friendID);
		await friendsDB.deleteFriendDBfromUser(db, userID1, msg.friendID);
	} catch (err) {
		socket.emit('message', {action: '', subaction: '', msg: 'Database error'});
		console.error(err);
	}
}

export async function handleFriends(msg, socket, userId1, io) {
	// console.log("handleFriends function...", msg.action + " " + msg.subaction);
	switch (msg.subaction) {
		case "getFriends":
			return getFriends(userId1, socket);
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
		default:
			console.log(`Unknown subaction ${msg.subaction}`);
			sendContentToFrontend('error', '', socket, "no", "Unkown action");
	}
}
