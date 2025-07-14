import * as dbFunctions from '../Database/database.js';
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

async function getOnlinePlayers(msg, socket) {
	try {
		const onlineUsers = await dbFunctions.getOnlineUsers();
		// console.log("Recieved DB content: ", onlineUsers);
		if (!onlineUsers || onlineUsers.length === 0 || onlineUsers == "[]" || onlineUsers == "undefined") {
			console.log("No online players found");
			return sendContentToFrontend('online', 'retOnlinePlayers', socket, "no", "No online players found");
		}
		return sendContentToFrontend('online', 'retOnlinePlayers', socket, "yes", onlineUsers);
	}
	catch(err) {
		console.error(err);
		return sendContentToFrontend('error', 'error', socket, "no", "Error while requesting online players");
	}
}

async function logoutPlayer(msg, socket) {
	try {
		dbFunctions.updateOnlineStatus(msg.id, false);
	}
	catch(err) {
		console.error(err.msg);
		return sendContentToFrontend('error', 'error', socket, "no", "Error while logging out");
	}
}

export async function handleOnlinePlayers(msg, socket) {
	console.log("handleOnlinePlayers function...", msg.action);
	if (msg.action == "getOnlinePlayers")
		return getOnlinePlayers(msg, socket);
	if (msg.action == 'logout')
		return logoutPlayer(msg, socket);
	return sendContentToFrontend('error', 'error', socket, "no", "Unkown action");
}
