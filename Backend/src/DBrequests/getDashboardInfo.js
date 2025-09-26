import { getUserByID } from '../Database/users.js';
import { getMatchByID } from '../Database/match.js';
import { getMatchHistoryDB, getUserMatchStatsDB, getUserStateDurationsDB } from '../Database/dashboard.js';
import { handleError } from '../errors.js'
import { db } from '../index.js';

async function getDashboardInfo(socket, playerID) {
	try {
		const player = await getUserByID(db, playerID);
		const stats = await getUserMatchStatsDB(db, playerID);
		const matches = await getMatchHistoryDB(db, playerID);
		const log_time = await getUserStateDurationsDB(db, playerID);

		const returnMsg = {
			action: "dashboardInfo",
			subaction: "receivePlayerData",
			player,
			matches,
			stats,
			log_time
		};
		socket.emit('message', returnMsg);
		return true;
	} catch (err) {
		handleError(socket, 'DB_NOT_FOUND', 'Database error', err.message || err, 'getDashboardInfo')
		return false;
	}
}

async function validateUser(socket, playerID) {
	try {
		const player = await getUserByID(db, playerID);
		if (!player) {
			socket.emit('message', { action: "validate", subaction: "validateUser", valid: false, playerId: playerID });
		} else {
			socket.emit('message', { action: "validate", subaction: "validateUser", valid: true, playerId: playerID });
		}
	} catch (err) {
		socket.emit('message', { action: "validate", subaction: "validateUser", valid: true, playerId: playerID });
	}
}

async function validateMatch(socket, matchID) {
	try {
		const match = await getMatchByID(db, matchID);
		if (!match) {
			socket.emit('message', { action: "validate", subaction: "validateMatch", valid: false, matchId: matchID });
		} else {
			socket.emit('message', { action: "validate", subaction: "validateMatch", valid: true, matchId: matchID });
		}
	} catch (err) {
		socket.emit('message', { action: "validate", subaction: "validateMatch", valid: true, matchId: matchID });
	}
}

export function handleDashboardMaking(msg, socket, playerID) {
	if (!msg || msg.action !== 'dashboard' || !msg.subaction) {
		handleError(socket, 'MSG_MISSING_ACTION', "Invalid message format", msg, 'handleDashboardMaking');
		return false;
	}
	if (msg.subaction === 'validateUser') {
		validateUser(socket, msg.playerId);
		return true;
	}
	if (msg.subaction === 'validateMatch') {
		validateMatch(socket, msg.matchId);
		return true;
	}
	if (msg.subaction === 'getFullDataDashboard') {
		return getDashboardInfo(socket, playerID);
	} else {
		handleError(socket, 'MSG_UNKNOWN_SUBACTION', "Invalid message format", msg.subaction, 'handleDashboardMaking');
		return false;
	}
}
