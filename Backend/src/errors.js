const RED   = '\x1b[31m';
const RESET = '\x1b[0m';

function ts() {
	return (new Date().toISOString().slice(0,19).replace('T',' '));
}

export function handleError(socket, code, reason, detail, functionName) {
	const prefix = `${RED}[${ts()}]`;
	const suffix = RESET;

	// ERROR message for backend
	console.error(prefix, code, reason, detail, functionName, suffix);

	// ERROR message for frontend
	socket.emit('server_error', {
		code,
		reason
	})
}