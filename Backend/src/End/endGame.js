import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state, OT } from "../SharedBuild/enums.js";
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

export async function saveMatch(socket, matchID) {
	const matchInfo = await handleMatchEndedDB(db, matchID);

	matches.delete(matchID);

	// Send a message to the frontend
	// socket.emit('message', {
	// 	action: 'game',
	// 	subaction: 'save',
	// 	matchID: match.matchID,
	// 	success: true,
	// 	chartUrl
	// });
}
