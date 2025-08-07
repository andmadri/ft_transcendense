import * as friendsDB from '../Database/friends.js';
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content, nr) {
	const msg = {
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content,
		playerNr: nr
	}
	socket.send(JSON.stringify(msg));
}

async function getFriends(playerNr, socket) {
	try {
		// const friends = await friendsDB.getFriendsDB();
		if (!friends || friends.length === 0 || friends == "[]" || friends == "undefined") {
			console.log("No friends found");
			return sendContentToFrontend('friends', 'retFriends', socket, "no", "No friends found", playerNr);
		}
		return sendContentToFrontend('friends', 'retFriends', socket, "yes", friends, playerNr);
	}
	catch(err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while requesting friends", playerNr);
	}
}

export async function handleFriends(msg, socket) {
	console.log("handleFriends function...", msg.action);
	if (msg.subaction == "getFriends") {
		const playerNr = msg.player;
		return getFriends(playerNr, socket);
	}
	return sendContentToFrontend('error', '', socket, "no", "Unkown action");
}
