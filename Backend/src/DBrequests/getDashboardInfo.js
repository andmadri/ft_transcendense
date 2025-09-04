import { getUserByID } from '../Database/users.js';
import { getMatchHistoryDB, getUserMatchStatsDB, getUserStateDurationsDB } from '../Database/dashboard.js';
import { db } from '../index.js';

async function getDashboardInfo(msg, socket, userId1) {
	let player = await getUserByID(db, userId1);
	let stats = await getUserMatchStatsDB(db, userId1);
	let matches = await getMatchHistoryDB(db, userId1);
	let log_time = await getUserStateDurationsDB(db, userId1);

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

export function handleDashboardMaking(msg, socket, userId1) {
	if (!msg || msg.action !== 'dashboard' || !msg.subaction) {
		const returnMsg = { action: "error", reason: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('error', returnMsg);
		return false;
	}
	if (msg.subaction === 'getFullDataDashboard') {
		getDashboardInfo(msg, socket, userId1);
		return true;
	} else {
		const returnMsg = { action: "error", reason: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('error', returnMsg);
		return false;
	}
}
