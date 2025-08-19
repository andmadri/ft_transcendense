import * as userDB from '../Database/users.js';
import { db } from '../index.js';

function sendContentToFrontend(actionable, sub, socket, accessible, content) {
	const msg = {
		action: actionable,
		subaction: sub,
		access: accessible,
		content: content
	}
	socket.send(msg);
}

async function getOnlinePlayers(msg, socket) {
	try {
		const onlineUsers = await userDB.getOnlineUsers(db);
		console.log("Recieved DB content: ", onlineUsers);
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

export async function handleOnlinePlayers(msg, socket) {
	console.log("handleOnlinePlayers function...", msg.action);
	if (msg.subaction == "getOnlinePlayers")
		return getOnlinePlayers(msg, socket);
	return sendContentToFrontend('error', '', socket, "no", "Unkown action");
}
