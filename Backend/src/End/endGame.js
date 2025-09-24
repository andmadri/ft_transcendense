import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state, OT } from "../SharedBuild/enums.js";
import { db } from "../index.js";

export async function quitMatch(match, msg, io) {
	console.log(`match quit by ${msg.player}`);
	if (match.mode === OT.Online && !match.winnerID) {
		match.winnerID = msg.player == match.player1.ID ? match.player2.ID : match.player1.ID;
	}
	else if (match.mode !== OT.Online){
		console.log(`quitmatch ${msg.winner}`);
		match.winnerID = msg.winner
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

export async function saveMatch(matchID) {
	await handleMatchEndedDB(db, matchID);
	matches.delete(matchID);
}
