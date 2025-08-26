import { getUserMatchStatsDB, getAllUserStateDurationsDB } from "../Database/sessions.js";
import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state } from "../SharedBuild/enums.js"

export async function quitMatch(match, msg, socket) {
	const name = msg.name ? msg.name : 'unknown player';
	socket.send({
		action: 'game',
		subaction: 'quit',
		matchID: match.matchID,
		reason: `match quit by player ${msg.name}`
	});
	match.state = state.End;
}

export async function saveMatch(db, match, msg, socket) {
	// Update the match in the database
	const matchID = await handleMatchEndedDB(db, msg.matchID);
	
	// Show some stats in the terminal
	console.table(matchID);
	console.log(await getUserMatchStatsDB(db, matchID.player_1_id));
	console.log(await getUserMatchStatsDB(db, matchID.player_2_id));
	console.table(await getAllUserStateDurationsDB(db));

	// Delete the match in the backend
	matches.delete(match.matchID);

	// Send a message to the frontend
	socket.send({
		action: 'game',
		subaction: 'save',
		matchID: match.matchID,
		success: true
	});
}
