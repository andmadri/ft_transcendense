import { Game } from "../gameData.js"

export function cancelOnlineMatch() {
	Game.socket.send({ 
		action: 'matchmaking',
		subaction: 'cancelOnlineMatch',
		matchID: Game.match.ID
	});
}

// send when player wants to play an online game
export function searchMatch(userID: number) {
	
	Game.socket.send({
		action: 'matchmaking',
		subaction: 'createOnlineMatch',
		userID: userID
	});
}
