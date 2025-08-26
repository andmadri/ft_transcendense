import * as friendsDB from '../Database/friends.js';
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content, nr) {
	socket.send({
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content,
		playerNr: nr
	});
}

async function acceptFriendRequest(socket, data) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		if (err.message.includes('No pending')) {
			socket.send({action: 'friends', subaction: 'error', msg: err.message})
		} else {
			socket.send({action: 'error', msg: 'Database error'});
			console.error(err);			
		}
	}
}

async function denyFriendRequest(socket, data) {
	try {
		await friendsDB.acceptFriendRequestDB(db, data.requestId);
	} catch (err) {
		if (err.message.includes('No pending')) {
			socket.send({action: 'friends', subaction: 'error', msg: err.message})
		} else {
			socket.send({action: 'error', msg: 'Database error'});
			console.error(err);			
		}
	}
}

async function getFriends(playerNr, socket) {
	try {
		const friends = await friendsDB.getFriendsDB(db, playerNr);
		if (!friends || friends.length === 0) {
			return sendContentToFrontend('friends', 'retFriends', socket, "no", "No friends found", playerNr);
		}
		return sendContentToFrontend('friends', 'retFriends', socket, "yes", friends, playerNr);
	} catch (err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while requesting friends", playerNr);
	}
}

export async function openFriendRequest(playerNr, socket) {
	try {
		const requests = await friendsDB.getOpenFriendRequestsDB(db, playerNr);
		if (!requests || requests.length === 0)
			return ;
		return sendContentToFrontend('friends', 'openRequests', socket, "yes", requests, playerNr);
	} catch (err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while fetching open requests", playerNr);
	}
}

export async function addFriendRequest(socket, data) {
	try {
		await friendsDB.addFriendRequestDB(db, data.id, data.friend);
		socket.send({action: '', subaction: '', msg: 'request sent'});
	} catch (err) {
		if (err.message.includes('already exists')) {
			socket.send({action: 'friends', subaction: '', msg: 'request already sent'});
		} else {
			socket.send({action: '', subaction: '', msg: 'Database error'});
			console.error(err);
		}
	}
}

export async function handleFriends(msg, socket, io) {
	console.log("handleFriends function...", msg.action);
	switch (msg.subaction) {
		case "getFriends":
			const playerNr = msg.player;
			return getFriends(playerNr, socket);
		case 'friendRequest':
			addFriendRequest(socket, msg);
			break ;
		case 'openFriendRequest':
			openFriendRequest(playerNr, socket);
			break ;
		case 'acceptFriendRequest':
			acceptFriendRequest(socket, msg);
			break ;
		case 'denyFriendRequest':
			denyFriendRequest(msg, socket);
			break ;
		default:
			sendContentToFrontend('error', '', socket, "no", "Unkown action");
	}
}
