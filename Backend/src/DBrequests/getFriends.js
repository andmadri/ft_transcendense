import * as friendsDB from '../Database/friends.js';
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content) {
	const msg = {
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content
	}
	socket.send(JSON.stringify(msg));
}

async function getFriends(msg, socket) {
	try {
		const friends = await friendsDB.getFriendsDB();
		if (!friends || friends.length === 0 || friends == "[]" || friends == "undefined") {
			console.log("No friends found");
			return sendContentToFrontend('friends', 'retFriends', socket, "no", "No friends found");
		}
		return sendContentToFrontend('friends', 'retFriends', socket, "yes", friends);
	}
	catch(err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while requesting friends");
	}
}

export async function handleFriends(msg, socket) {
	console.log("handleFriends function...", msg.action);
	if (msg.subaction == "getFriends")
		return getFriends(msg, socket);
	return sendContentToFrontend('error', '', socket, "no", "Unkown action");
}
