import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state, OT } from "../SharedBuild/enums.js";
import { db } from "../index.js";

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
	await handleMatchEndedDB(match, db, match.matchID);
	matches.delete(match.matchID);
}
