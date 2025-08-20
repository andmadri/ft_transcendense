import { Game } from "../gameData.js"

// send when player wants to play an online game
export function searchMatch(userID: number) {
	
	Game.socket.send({
		action: 'matchmaking',
		subaction: 'createOnlineMatch',
		userID: userID
	});
}
