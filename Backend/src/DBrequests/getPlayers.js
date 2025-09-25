import * as userDB from '../Database/users.js';
import * as friendDB from '../Database/friends.js'

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
		const players = await userDB.getAllPlayers(db);
		const friendsIds = await friendDB.getFriendsOnlyIdDB(db, userID);
		const friendsIdsSet = new Set(friendsIds);

		for (const player of players) {
			player.isFriend = friendsIdsSet.has(player.id);
		}
		return sendContentToFrontend('players', 'retPlayers', socket, "yes", players);
	} catch (err) {
		handleError(socket, 'DB_ERROR', 'Error while requesting players', err.message || err, 'getAllPlayerInclFriends');
	}
}

export async function handlePlayers(db, msg, socket, userId) {
	if (msg.subaction == 'getAllPlayers')
		return getAllPlayerInclFriends(db, userId, socket);
	handleError(socket, 'MSG_UNKNOWN_SUBACTION', 'Invalid message format', `Unknown: ${msg.subaction}`, 'handlePlayers');
}

