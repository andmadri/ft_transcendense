import { getUserByID } from '../Database/users.js';
import { getMatchHistoryDB } from '../Database/dashboard.js';
import { getUserMatchStatsDB } from '../Database/sessions.js';
import { getUserStateDurationsDB } from '../Database/sessions.js';
import { db } from '../index.js';

async function getDashboardInfo(msg, socket, playerID) {
	let player = await getUserByID(db, playerID);
	let stats = await getUserMatchStatsDB(db, playerID);
	let matches = await getMatchHistoryDB(db, playerID);
	let log_time = await getUserStateDurationsDB(db, playerID);
	console.log("Recieved DB content: ", matches);

	let returnMsg = {
		action: "dashboardInfo",
		subaction: "receivePlayerData",
		player,
		matches,
		stats,
		log_time
	};
	socket.emit('message', returnMsg);
	// socket.send(JSON.stringify(returnMsg));
}

export function handleDashboardMaking(msg, socket, playerID) {
	if (!msg || msg.action !== 'dashboard' || !msg.subaction) {
		const returnMsg = { action: "error", reason: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.emit('error', returnMsg);
		return false;
	}
	if (msg.subaction === 'getFullDataDashboard') {
		console.log('Received request for dashboard data:', msg, playerID);
		getDashboardInfo(msg, socket, playerID);
		return true;
	} else {
		const returnMsg = { action: "error", reason: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.emit('error', returnMsg);
		return false;
	}
}

/* 

[
{ opponent name, date (DD-MM-YYYY (maybe time aswell)), winner, my_score, opp_score, duration, total_hits}
{ opponent name, date (DD-MM-YYYY (maybe time aswell)), winner, my_score, opp_score, duration, total_hits}
{ opponent name, date (DD-MM-YYYY (maybe time aswell)), winner, my_score, opp_score, duration, total_hits}

]

- All the matches from one user
- Sorted in descending order (newest match on top, oldest match in the bottom)
- We only want to have the match when the match is finished
- Call the function: getMatchHistoryDB
*/