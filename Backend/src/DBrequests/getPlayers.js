import * as userDB from '../Database/users.js';
import * as friendDB from '../Database/friends.js'
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content) {
	const msg = {
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content
	}
	socket.emit('message', msg);
}

export async function getAllPlayerInclFriends(db, userID, socket) {
	try {
		console.log("Getting all players including friends info for userID:", userID);
		const players = await userDB.getAllPlayers(db);
		// console.log("players: ", players);
		const friendsIds = await friendDB.getFriendsOnlyIdDB(db, userID);
		const friendsIdsSet = new Set(friendsIds);

		for (const player of players) {
			player.isFriend = friendsIdsSet.has(player.id);
		}
		// console.log("Players with friends info: ", players);
		return sendContentToFrontend('players', 'retPlayers', socket, "yes", players);
	} catch (err) {
		console.error(err);
		sendContentToFrontend('error', '', socket, "no", "Error while requesting players");
	}
}

export async function handlePlayers(msg, socket, userId) {
	if (msg.subaction == 'getAllPlayers')
		return getAllPlayerInclFriends(db, userId, socket);
	sendContentToFrontend('error', '', socket, "no", "Unkown action");
}

