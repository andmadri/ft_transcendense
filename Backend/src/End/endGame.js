import { getUserMatchStatsDB, getAllUserStateDurationsDB } from "../Database/dashboard.js";
import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state, OT } from "../SharedBuild/enums.js";
import { generateAllChartsForMatch } from "./createGameStats.js";
import { db } from "../index.js";

export async function quitMatch(match, msg, io) {
	if (match.mode == OT.Online) {
		match.winnerID = msg.player == match.player1.ID ? match.player2.ID : match.player1.ID;
	}
	else {
		match.winnerID = msg.winnerID
	}
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'quit',
		matchID: match.matchID,
		winner: match.winnerID,
		reason: `match quit by player ${msg.name}`
	});
	match.state = state.End;
}

export async function saveMatch(match, matchID) {
	// Update the match in the database
	// console.log("\n\nsaveMatch - match.matchID.id:", match.matchID.id);
	const matchInfo = await handleMatchEndedDB(db, matchID);
	
	generateAllChartsForMatch(db, matchInfo, matchID);
	// // ADDED FOR CREATING IMAGE IN THE BACKEND - start
	// const idForName = String(match?.matchID ?? matchID?.id ?? match?.matchID ?? Date.now());

	// const svgPath = await renderUserStateDurationsSVG(db, {
	// 	outDir: path.join(uploadsBase, 'charts', idForName),
	// 	fileName: `user_state_durations_match_${idForName}.svg`,
	// 	width: 1000,
	// 	barHeight: 26
	// });
	// console.log('Chart saved at:', svgPath);
	// // console.log('2. Chart saved at:', svgPath);
	// // console.log('3. Chart saved at:', svgPath);

	// Delete the data in the backend
	matches.delete(matchID);

	// const chartUrl = `/api/charts/user-state-durations/${idForName}`;
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
