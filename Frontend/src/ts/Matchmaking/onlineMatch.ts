import { Game } from "../script.js";

export function searchMatch(userID: number) {
	const msg = {
		action: 'matchmaking',
		subaction: 'createOnlineMatch',
		userID: userID
	}
	Game.socket.send(JSON.stringify(msg));
}