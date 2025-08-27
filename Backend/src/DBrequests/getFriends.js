import * as friendsDB from '../Database/friends.js';
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content, nr) {
	socket.emit('message', {
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content,
		playerNr: nr
	});
}

async function acceptFriendRequest(socket, data, playerNr) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		if (err.message.includes('No pending')) {
			sendContentToFrontend('friends', 'error', 'no', err.message, playerNr);
		} else {
			socket.emit('message', {action: 'error', msg: 'Database error'});
			console.error(err);			
		}
	}
}

async function denyFriendRequest(socket, data, playerNr) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		if (err.message.includes('No pending')) {
			sendContentToFrontend('friends', 'error', socket, 'no', err.message, playerNr);
		} else {
			socket.emit('message', {action: 'error', msg: 'Database error'});
			console.error(err);			
		}
	}
}

async function getFriends(playerNr, userId1, socket) {
	try {
		const friends = await friendsDB.getFriendsDB(db, userId1);
		if (!friends || friends.length === 0) {
			return sendContentToFrontend('friends', 'retFriends', socket, "no", "No friends found", playerNr);
		}
		return sendContentToFrontend('friends', 'retFriends', socket, "yes", friends, playerNr);
	} catch (err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while requesting friends", playerNr);
	}
}

export async function openFriendRequest(userId1, socket, playerNr) {
	console.log("check open friend request for userid: ", userId1);
	try {
		const requests = await friendsDB.getOpenFriendRequestsDB(db, userId1);
		if (!requests || requests.length === 0) {
			console.log("no open requests");
			return ;
		}
		console.log(`Send back requests:`, requests);
		sendContentToFrontend('friends', 'openRequests', socket, "yes", requests, playerNr);
	} catch (err) {
		console.error("DB error: ", err);
		sendContentToFrontend('error', '', socket, "no", "Error while fetching open requests", playerNr);
	}
}

export async function addFriendRequest(socket, userId1, data, playerNr) {
	try {
		await friendsDB.addFriendRequestDB(db, userId1, data.friendID);
	} catch (err) {
		if (err.message.includes('already exists')) {
			sendContentToFrontend('friends', 'error', socket, "no", err.message, playerNr);
		} else {
			socket.emit('message', {action: '', subaction: '', msg: 'Database error'});
			console.error(err);
		}
	}
}

async function deleteFriend(socket, userID1, msg) {
	try {
		console.log('Try to delete friend', userID1, msg.friendID);
		// IMPROVE FUNCTION DELETEFRIENDDB TO DO THIS
		friendsDB.deleteFriendDB(db, userID1, msg.friendID);
		friendsDB.deleteFriendDB(db, msg.friendID, userID1);
	} catch (err) {
		socket.emit('message', {action: '', subaction: '', msg: 'Database error'});
		console.error(err);
	}
}

export async function handleFriends(msg, socket, userId1, io) {
	console.log("handleFriends function...", msg.action + " " + msg.subaction);
	const playerNr = msg.playerNr ? msg.playerNr : 1;
	switch (msg.subaction) {
		case "getFriends":
			return getFriends(playerNr, userId1, socket);
		case 'friendRequest':
			addFriendRequest(socket, userId1, msg, playerNr);
			break ;
		case 'openFriendRequests':
			openFriendRequest(userId1, socket, playerNr);
			break ;
		case 'acceptFriendRequest':
			acceptFriendRequest(socket, msg, playerNr);
			break ;
		case 'denyFriendRequest':
			denyFriendRequest(socket, msg, playerNr);
			break ;
		case 'unfriend':
			deleteFriend(socket, userId1, msg);
			break ;
		default:
			console.log(`Unknown subaction ${msg.subaction}`);
			sendContentToFrontend('error', '', socket, "no", "Unkown action");
	}
}
