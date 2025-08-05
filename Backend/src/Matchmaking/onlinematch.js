import { getUserByID } from "../Database/user.js";
import { newMatch } from "../Game/gameMatch.js";
import { waitlist, matches } from "../Game/gameMatch.js";
import { Stage } from "../Game/gameMatch.js";

// add username for creating match, add user to waitinglist and add socket to room
async function createMatchOnline(socket, userID) {
	try {
		const user = await getUserByID(userID);
		if (!user || !user.name) {
			console.log(`No username found in createMatchOnline`);
			return ;
		}
		const id = newMatch(userID, user.name, '1', 'player2');
		matches.get(id).saveInDB = true;
		waitlist.set(id, { match: matches.get(id) });
		socket.join(id);
	} catch(err) {
		console.error(err);
	}
}

// get (and delete) the first item in/from the waitinglist and returns the matchID and match
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

	if (!match) {
		createMatchOnline(socket, userID);
	} else {
		socket.join(roomID);
		match.roomID = roomID;
		match.player2.id = userID;
		match.stage = Stage.Playing; // we are not doing something with this yet...

		const msg = {
			action: 'game',
			subaction: 'init',
			id: Number(roomID),
			player1ID: match.player1.id,
			player2ID: match.player2.id
		}
		io.to(roomID).emit('message', JSON.stringify(msg));
	}
}
