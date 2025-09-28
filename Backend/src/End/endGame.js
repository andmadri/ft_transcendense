import { handleMatchEndedDB } from "../Services/matchService.js";
import { matches } from "../InitGame/match.js";
import { state, OT } from "../SharedBuild/enums.js";
import { db } from "../index.js";

export async function stopMatchAfterRefresh(io, userId1) {
	try {
		for (const [, match] of matches) {
			if (match.state !== state.Start && match.state !== state.Pending &&
				match.state !== state.Init && match.state !== state.End) {
				let name = '';
				if (userId1 === match.player1.ID) {
					name = match.player1.name;
				} else if (userId1 === match.player2.ID) {
					name = match.player2.name;
				}
				if (match.mode !== OT.Online) {
					match.winnerID = match.player2.ID;
					await saveMatch(match.matchID, match.winnerID);
				}
				if (name) {
					await quitMatch(match, {name, player: userId1}, io);
				}
			}
		}
	} catch (err) {
		console.error(`MATCH_QUIT Error while quitting match by disconnect`, err, "stopMatchAfterRefresh");
	}
}

export async function quitMatch(match, msg, io) {
	if (match.mode === OT.Online && !match.winnerID) {
		match.winnerID = msg.player == match.player1.ID ? match.player2.ID : match.player1.ID;
	}
	else if (match.mode !== OT.Online){
		match.winnerID = match.player2.ID;
	}
	match.state = state.End;
	console.log(`match quit by ${msg.player} | WinnerID = ${match.winnerID}`);
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'quit',
		matchID: match.matchID,
		winner: match.winnerID,
		reason: `match quit by player ${msg.name}`
	});
}

export async function saveMatch(matchID, winnerID) {
	await handleMatchEndedDB(db, matchID, winnerID);
	matches.delete(matchID);
}
