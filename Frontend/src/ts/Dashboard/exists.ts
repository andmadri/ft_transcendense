import { Game } from '../gameData';

const pendingUser = new Map<number, (ok: boolean) => void>();
const pendingMatch = new Map<number, (ok: boolean) => void>();

function getParam(query: string, key: string): number | null {
	const v = new URLSearchParams(query).get(key);
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

async function userExists(playerID: number): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		pendingUser.set(playerID!, resolve);
		const msg = {action: 'dashboard', subaction: 'validateUser', playerId: playerID};
		Game.socket.emit('message', msg);
		setTimeout(() => {
			if (pendingUser.get(playerID!) === resolve) {
				pendingUser.delete(playerID!);
				resolve(false);
			}
		}, 3000);
	});
}

async function matchExists(matchID: number): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		pendingMatch.set(matchID!, resolve);
		const msg = {action: 'dashboard', subaction: 'validateMatch', matchId: matchID};
		Game.socket.emit('message', msg);
		setTimeout(() => {
			if (pendingMatch.get(matchID!) === resolve) {
				pendingMatch.delete(matchID!);
				resolve(false);
			}
		}, 3000);
	});
}

export async function validateQuery(page: string, query: string): Promise<boolean> {
	if (page === 'Dashboard') {
		const userId = getParam(query, 'userId');
		if (!userId)
			return Promise.resolve(false);
		return await userExists(userId);
	} else if (page === 'GameStats') {
		const matchId = getParam(query, 'matchId');
		if (!matchId)
			return Promise.resolve(false);
		return await matchExists(matchId);
	}
	return Promise.resolve(true);
}

export function validateURL(msg: any) {
	if (msg.subaction === 'validateUser' && typeof msg.playerId === 'number') {
		const resolve = pendingUser.get(msg.playerId);
		if (resolve) {
			pendingUser.delete(msg.playerId);
			resolve(!!msg.valid);
		}
		return ;
	} else if (msg.subaction === 'validateMatch' && typeof msg.matchId === 'number') {
		const resolve = pendingMatch.get(msg.matchId);
		if (resolve) {
			pendingMatch.delete(msg.matchId);
			resolve(!!msg.valid);
		}
		return ;
	} else {
		console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', msg.subaction, 'validateURL');
	}
}
