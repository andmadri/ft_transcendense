import { getUserByID } from "../Database/users.js";
import { newMatch } from "../Game/gameMatch.js";
import { waitlist, matches } from "../Game/gameMatch.js";
import { Stage } from "../Game/gameMatch.js";
import { db } from "../index.js"
import { OT } from '../structs.js';

async function createMatchOnline(socket, userID) {
	try {
		const user = await getUserByID(db, userID);
		if (!user || !user.name) {
			console.log("No username found in createMatchOnline");
			return ;
		}
		const id = newMatch(userID, user.name, '', '', OT.Online);
		matches.get(id).saveInDB = true;
		waitlist.set(id, { match: matches.get(id) });
		socket.join(id);
	} catch(err) {
		console.error(err);
		return ;
	}
}

export function findOpenMatch() {
	if (waitlist.size === 0)
		return ([null, null]);

	const item = waitlist.entries().next();
	if (item.done)
		return [null, null];
	const [firstWaitingID, matchObj] = item.value;
	waitlist.delete(firstWaitingID);
	return ([firstWaitingID, matchObj.match]);
}

// checks if there is already someone waiting
// if no -> make new match
// if so -> add second player to match and room and send msg back
export async function handleOnlineMatch(socket, userID, io) {
	const [roomID, match] = findOpenMatch();

	// if match is found, both are add to the room and get the msg to init the game + start
	if (match) {
		socket.join(roomID);
		match.roomID = roomID;
		match.player2.id = userID;
		match.stage = Stage.Playing;
		const msg = {
			action: 'game',
			subaction: 'init',
			id: Number(roomID),
			player1ID: match.player1.id,
			player2ID: match.player2.id
		}
		const sockets = await io.in(roomID).allSockets();
		console.log(`Aantal clients in room: ${sockets.size}`);
		console.log(`roomid: ${roomID}`);

		console.log(`send onlineMatch back to both sockets...${roomID}`);
		io.to(roomID).emit('message', JSON.stringify(msg));
		// send back opponent found to both... play

	} else {
		createMatchOnline(socket, userID); 
	}
}
