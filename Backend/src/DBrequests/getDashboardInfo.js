import { getUserByID } from '../Database/users.js';
import { getMatchByID } from '../Database/match.js';
import { getMatchHistoryDB, getUserMatchStatsDB, getUserStateDurationsDB } from '../Database/dashboard.js';
import { db } from '../index.js';

async function getDashboardInfo(msg, socket, playerID) {
	let player = await getUserByID(db, playerID);
	let stats = await getUserMatchStatsDB(db, playerID);
	let matches = await getMatchHistoryDB(db, playerID);
	let log_time = await getUserStateDurationsDB(db, playerID);

	let returnMsg = {
		action: "dashboardInfo",
		subaction: "receivePlayerData",
		player,
		matches,
		stats,
		log_time
	};
	socket.emit('message', returnMsg);
}

async function validateUser(socket, playerID) {
	const player = await getUserByID(db, playerID);
	if (!player) {
		socket.emit('message', { action: "validate", subaction: "validateUser", valid: false, playerId: playerID });
	} else {
		socket.emit('message', { action: "validate", subaction: "validateUser", valid: true, playerId: playerID });
	}
}

async function validateMatch(socket, matchID) {
	const match = await getMatchByID(db, matchID);
	if (!match) {
		socket.emit('message', { action: "validate", subaction: "validateMatch", valid: false, matchId: matchID });
	} else {
		socket.emit('message', { action: "validate", subaction: "validateMatch", valid: true, matchId: matchID });
	}
}

export function handleDashboardMaking(msg, socket, playerID) {
	if (!msg || msg.action !== 'dashboard' || !msg.subaction) {
		const returnMsg = { action: "error", reason: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('error', returnMsg);
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
		getDashboardInfo(msg, socket, playerID);
		return true;
	} else {
		const returnMsg = { action: "error", reason: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('error', returnMsg);
		return false;
	}
}
