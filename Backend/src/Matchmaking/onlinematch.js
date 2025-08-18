import { getUserByID } from "../Database/users.js";
import { newMatch } from "../Game/gameMatch.js";
import { waitlist, matches } from "../Game/gameMatch.js";
import { Stage } from "../Game/gameMatch.js";
import { db } from "../index.js"
import { handleMatchStartDB } from "../Services/matchService.js";
import { OT } from "../structs.js";

async function addToWaitinglist(socket, userID) {
	waitlist.set(waitlist.size, { socket, userID });
}

export function findOpenMatch() {
	if (waitlist.size === 0)
		return ([null, null]);

	const item = waitlist.entries().next();
	if (item.done)
		return ([null, null]);
	const [nr, userInfo] = item.value;
	waitlist.delete(nr);
	return ([userInfo.socket, userInfo.userID]);
}

async function getNamebyUserID(userID) {
	try {
		const user = await getUserByID(db, userID);
		if (user && user.name)
			return (user.name);
		else {
			if (!user)
				console.error(`User ${userID} not found in db`);
			else
				console.error(`Username not found in user with ID ${userID}`);
			return (null);
		}
	} catch(err) {
		console.error(err);
		return (null);
	}
}

// checks if there is already someone waiting
// if no -> make new match
// if so -> add second player to match and room and send msg back
export async function handleOnlineMatch(socket, userID, io) {
	const [socket2, userID2] = findOpenMatch();

	// if match is found, both are add to the room and get the msg to init the game + start
	if (socket2) {
		console.log("Player in waitinglist found, making new match");
		const name1 = await getNamebyUserID(userID);
		const name2 = await getNamebyUserID(userID2);
		if (!name1 || !name2) {
			console.error("Something went wrong handle Online Match");
			return ;
		}
		const matchID = await handleMatchStartDB(db, { 
			player_1_id: userID, 
			player_2_id: userID2
		});
		newMatch(matchID, userID, name1, userID2, name2, OT.Online);
		console.log(`New match ${matchID} is made with ${name1} and ${name2}`);
		socket.join(matchID);
		socket2.join(matchID);
		matches.get(matchID).stage = Stage.Init;
		const msg = {
			action: 'game',
			subaction: 'init', // change
			id: Number(matchID),
			player1ID: userID,
			player2ID: userID2
		}
		const sockets = await io.in(matchID).allSockets();
		console.log(`Aantal clients in room: ${sockets.size}`);
		console.log(`matchID: ${matchID}`);

		console.log(`send onlineMatch back to both sockets...${matchID}`);
		io.to(matchID).emit('message', JSON.stringify(msg));
		// send back opponent found to both... play

	} else {
		console.log("No open match found...adding player to waitinglist");
		addToWaitinglist(socket, userID); 
	}
}
