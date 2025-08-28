import { getUserByID } from '../Database/users.js';
import { getMatchHistoryDB, getUserMatchStatsDB, getUserStateDurationsDB } from '../Database/dashboard.js';
import { db } from '../index.js';

async function getDashboardInfo(msg, socket, userId1) {
	let player = await getUserByID(db, userId1);
	let stats = await getUserMatchStatsDB(db, userId1);
	let matches = await getMatchHistoryDB(db, userId1);
	let log_time = await getUserStateDurationsDB(db, userId1);
	console.log("Recieved DB content: ", matches);

	let returnMsg = {
		action: "dashboardInfo",
		subaction: "receivePlayerData",
		player,
		matches,
		stats,
		log_time
	};
	socket.send(JSON.stringify(returnMsg));
}

export function handleDashboardMaking(msg, socket, userId1) {
if (!msg || !msg.action || msg.action !== 'dashboard' || !msg.subaction) {
		const returnMsg = { action: "Error", message: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.send(JSON.stringify(returnMsg));
		return false;
	}
	if (msg.subaction == 'getFullDataDashboard') {
		console.log('Received request for match data:', msg, userId1);
		getDashboardInfo(msg, socket, userId1);
		return true;
	} else {
		const returnMsg = { action: "Error", message: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.send(JSON.stringify(returnMsg));
		return false;
	}
}
