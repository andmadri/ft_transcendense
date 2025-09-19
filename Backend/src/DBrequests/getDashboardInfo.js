import { getUserByID } from '../Database/users.js';
import { getMatchHistoryDB, getUserMatchStatsDB, getUserStateDurationsDB } from '../Database/dashboard.js';
import { db } from '../index.js';

async function getDashboardInfo(socket, playerID) {
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
}

export function handleDashboardMaking(msg, socket, playerID) {
	if (!msg || msg.action !== 'dashboard' || !msg.subaction) {
		const returnMsg = { action: "error", reason: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('error', returnMsg);
		return false;
	}
	if (msg.subaction === 'getFullDataDashboard') {
		getDashboardInfo(socket, playerID);
		return true;
	} else {
		const returnMsg = { action: "error", reason: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('error', returnMsg);
		return false;
	}
}
