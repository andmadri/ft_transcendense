import { getUserMatchStatsDB, getAllUserStateDurationsDB } from "../Database/dashboard.js";
import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state } from "../SharedBuild/enums.js"
import { renderUserStateDurationsSVG } from '../Database/test.js';
import path from 'path';
import { db } from "../index.js";

const uploadsBase = process.env.UPLOADS_DIR || '/tmp/uploads';

export async function quitMatch(match, msg, socket, io) {
	const name = msg.name ? msg.name : 'unknown player';
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'quit',
		matchID: match.matchID,
		reason: `match quit by player ${msg.name}`
	});
	match.state = state.End;
}

export async function saveMatch(match, msg, socket) {
	// Update the match in the database
	const matchID = await handleMatchEndedDB(db, match.matchID);
	
	// Show some stats in the terminal
	// console.table(matchID);
	// console.log(await getUserMatchStatsDB(db, matchID.player_1_id));
	// console.log(await getUserMatchStatsDB(db, matchID.player_2_id));
	// console.table(await getAllUserStateDurationsDB(db));

	// ADDED FOR CREATING IMAGE IN THE BACKEND - start
	const idForName = String(match?.matchID ?? matchID?.id ?? match?.matchID ?? Date.now());

	const svgPath = await renderUserStateDurationsSVG(db, {
		outDir: path.join(uploadsBase, 'charts', idForName),
		fileName: `user_state_durations_match_${idForName}.svg`,
		width: 1000,
		barHeight: 26
	});
	console.log('Chart saved at:', svgPath);

	// Delete the data in the backend
	matches.delete(match.matchID);

	const chartUrl = `/api/charts/user-state-durations/${idForName}`;
	// ADDED FOR CREATING IMAGE IN THE BACKEND - stop

	// Send a message to the frontend
	// socket.emit('message', {
	// 	action: 'game',
	// 	subaction: 'save',
	// 	matchID: match.matchID,
	// 	success: true,
	// 	chartUrl
	// });
}
