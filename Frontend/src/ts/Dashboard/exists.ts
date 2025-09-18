import { Game, UI } from '../gameData'
import * as S from '../structs.js'

function getParam(query: string, key: string): number | null {
	const v = new URLSearchParams(query).get(key);
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

function userExists(playerID: number) {
	console.log(`Check userExists ${playerID}`);
	const msg = {action: 'dashboard', subaction: 'validateUser', playerId: playerID};
	Game.socket.emit('message', msg);

}

function matchExists(matchID: number) {
	console.log(`Check matchExists ${matchID}`);
	const msg = {action: 'dashboard', subaction: 'validateMatch', matchId: matchID};
	Game.socket.emit('message', msg);
}

export function validateQuery(page: string, query: string) {
	if (page === 'Dashboard') {
		const userId = getParam(query, 'userId');
		if (!userId)
			return ;
		userExists(userId);
	} else if (page === 'GameStats') {
		const matchId = getParam(query, 'matchId');
		if (!matchId)
			return ;
		matchExists(matchId);
	}
}

export function validateURL(msg: any) {
	if (msg.subaction === 'validateUser') {
		console.log(`validateUser ${msg.playerId} - ${msg.valid}`);
	} else if (msg.subaction === 'validateMatch') {
		console.log(`validateMatch ${msg.matchId} - ${msg.valid}`);
	} else {
		console.log(`(validateURL) Unknown action: ${msg.subaction}`);
	}
}
