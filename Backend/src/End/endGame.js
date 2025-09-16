import { getUserMatchStatsDB, getAllUserStateDurationsDB } from "../Database/dashboard.js";
import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state, OT } from "../SharedBuild/enums.js"
import { renderUserStateDurationsSVG } from '../Database/test.js';
import path from 'path';
import { db } from "../index.js";

const uploadsBase = process.env.UPLOADS_DIR || '/tmp/uploads';

export async function quitMatch(match, msg, io) {
	console.log(`match quit by ${msg.player}`);
	if (match.mode == OT.Online) {
		match.winnerID = msg.player == match.player1.ID ? match.player2.ID : match.player1.ID;
	}
	else {
		match.winnerID = msg.winnerID
	}
	match.state = state.End;
	console.log(`WinnerID = ${match.winnerID}`);
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'quit',
		matchID: match.matchID,
		winner: match.winnerID,
		reason: `match quit by player ${msg.name}`
	});
}

export async function saveMatch(match) {
	// Update the match in the database
	const matchID = await handleMatchEndedDB(match, db, match.matchID);
	
	// Show some stats in the terminal
	console.table(matchID);
	console.log(await getUserMatchStatsDB(db, matchID.player_1_id));
	console.log(await getUserMatchStatsDB(db, matchID.player_2_id));
	console.table(await getAllUserStateDurationsDB(db));

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
