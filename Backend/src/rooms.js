

export function addUserToRoom(socket, roomname) {
	console.log(`Added User to ${roomname}`);
	socket.join(roomname);
}

export function leaveRoom(socket, roomname) {
	console.log(`Remove User from ${roomname}`);
	try {
		socket.leave(roomname);
	} catch (err) {
		console.error(`ROOM_LEAVE No room with name ${roomname}`, err.message || err, "leaveRoom");
	}
}
