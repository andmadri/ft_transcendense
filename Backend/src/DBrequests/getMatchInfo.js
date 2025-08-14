// import * as userDB from '../Database/users.js';
// import { db } from '../index.js';

// async function getMatchData(msg, socket, userId1) {
// 	let player1 = null;
// if (userId1) {
// 		player1 = await userDB.getUserByID(db, userId1);
// 	}
// }

// export function handleMatchInfo(msg, socket, userId1) {
// if (!msg || !msg.action || msg.action !== 'matchInfo' || !msg.subaction) {
// 		const returnMsg = { action: "Error", message: "Invalid message format" };
// 		console.log('Invalid message format:', msg);
// 		socket.send(JSON.stringify(returnMsg));
// 		return false;
// 	}
// 	if (msg.subaction == 'getMatchData') {
// 		console.log('Received request for match data:', msg, userId1);
// 		getMatchData(msg, socket, userId1);
// 		return true;
// 	} else {
// 		const returnMsg = { action: "Error", message: "Unknown subaction" };
// 		console.log('Unknown subaction:', msg.subaction);
// 		socket.send(JSON.stringify(returnMsg));
// 		return false;
// 	}
// }