import { match } from 'assert';
import * as userDB from '../Database/users.js';
import { db } from '../index.js';

async function getMatchData(msg, socket, userId1) {
	let player1 = null;
	let matches = null;

	if (userId1) {
		player1 = await userDB.getUserByID(db, userId1);
	}
	
	//I need you
	matches = await getMatchesByUserId(db, user_id);
	console.log("Recieved DB content: ", onlineUsers);

	let returnMsg = {
		action: "matchInfo",
		subaction: "receivePlayerData",
		matches_array: matches
	};
	// for (const match of matches)
	// {
	// 	const opponent_id = match.player_1_id === user_id ? match.player_2_id : match.player_1_id;
	// 	player2 = await userDB.getUserByID(db, opponent_id);
	// 	let opponent = player2?.name || 'unknown';
	// 	returnMsg.matches.push({
	// 		opponent,
	// 		date: match.start_time,
	// 		score: `${match.player_1_score} - ${match.player_2_id}`,
	// 		duration:  match.end_time
  //     ? (new Date(match.end_time) - new Date(match.start_time)) / 1000
  //     : null,
	// 		totalHits: match.total_hits ?? null
	// 	});
	// }
	socket.send(JSON.stringify(returnMsg));
}

export function handleMatchInfo(msg, socket, userId1) {
if (!msg || !msg.action || msg.action !== 'matchInfo' || !msg.subaction) {
		const returnMsg = { action: "Error", message: "Invalid message format" };
		console.log('Invalid message format:', msg);
		socket.send(JSON.stringify(returnMsg));
		return false;
	}
	if (msg.subaction == 'getMatchData') {
		console.log('Received request for match data:', msg, userId1);
		getMatchData(msg, socket, userId1);
		return true;
	} else {
		const returnMsg = { action: "Error", message: "Unknown subaction" };
		console.log('Unknown subaction:', msg.subaction);
		socket.send(JSON.stringify(returnMsg));
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