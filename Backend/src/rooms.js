

export function addUserToRoom(socket, roomname) {
	console.log(`Added User to ${roomname}`);
	socket.join(roomname);
}
