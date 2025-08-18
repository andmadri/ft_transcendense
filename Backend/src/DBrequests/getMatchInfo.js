import { match } from 'assert';
import * as userDB from '../Database/users.js';
import { getMatchHistoryDB } from '../Database/dashboard.js';
import { db } from '../index.js';

async function getMatchData(msg, socket, userId1) {
	let player1 = null;
	let matches = null;

	if (userId1) {
		player1 = await userDB.getUserByID(db, userId1);
	}

	matches = await getMatchHistoryDB(db, userId1);
	console.log("Recieved DB content: ", matches);

	let returnMsg = {
		action: "matchInfo",
		subaction: "receivePlayerData",
		matches_array: matches
	};
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