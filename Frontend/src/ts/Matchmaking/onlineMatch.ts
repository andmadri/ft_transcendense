import { Game } from "../gameData.js";

export function cancelOnlineMatch() {
	Game.socket.emit('message',{ 
		action: 'matchmaking',
		subaction: 'cancelOnlineMatch',
		matchID: Game.match.matchID
	});
}

export function searchMatch(userID: number) {
	
	Game.socket.emit('message',{
		action: 'matchmaking',
		subaction: 'createOnlineMatch',
		userID: userID
	});
}
