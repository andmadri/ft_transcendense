import { Game } from "../script.js";

// send when player wants to play an online game
export function searchMatch(userID: number) {
	const msg = {
		action: 'matchmaking',
		subaction: 'createOnlineMatch',
		userID: userID
	}
	Game.socket.send(JSON.stringify(msg));
}
