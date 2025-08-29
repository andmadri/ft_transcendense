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

async function getOnlinePlayers(msg, socket) {
	try {
		const onlineUsers = await userDB.getOnlineUsers(db);
		if (!onlineUsers || onlineUsers.length === 0 || onlineUsers == "[]" || onlineUsers == "undefined") {
			console.log("No online players found");
			return sendContentToFrontend('online', 'retOnlinePlayers', socket, "no", "No online players found");
		}
		return sendContentToFrontend('online', 'retOnlinePlayers', socket, "yes", onlineUsers);
	}
	catch(err) {
		console.error(err);
		return sendContentToFrontend('error', '', socket, "no", "Error while requesting online players");
	}
}

export async function getAllPlayerInclFriends(db, userID, socket) {
	try {
		const players = await userDB.getAllPlayers(db);
		const friendsIds = await friendDB.getFriendsOnlyIdDB(db, userID);
		const friendsIdsSet = new Set(friendsIds);
		console.log("players: ", players);
		console.log('friendIDs: ', friendsIds);

		for (const player of players) {
    		player.isFriend = friendsIdsSet.has(player.id);
		}
		return sendContentToFrontend('online', 'retOnlinePlayers', socket, "yes", players);
	} catch (err) {
		console.error(err);
		sendContentToFrontend('error', '', socket, "no", "Error while requesting players");
	}
}

export async function handleOnlinePlayers(msg, socket, userId) {
	console.log("handleOnlinePlayers function...", msg.action);
	if (msg.subaction == "getOnlinePlayers")
		return getOnlinePlayers(msg, socket);
	else if (msg.subaction == 'getAllPlayers')
		return getAllPlayerInclFriends(db, userId, socket);
	sendContentToFrontend('error', '', socket, "no", "Unkown action");
}

