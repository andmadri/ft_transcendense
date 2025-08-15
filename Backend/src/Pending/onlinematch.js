
import { waitlist, matches } from "../InitGame/match.js";
import { Stage } from "../InitGame/match.js";
import { OT } from '../SharedBuild/OT.js'
import { assert } from "console";
import { createMatch } from "../InitGame/match.js";

async function addToWaitinglist(socket, userID) {
	waitlist.set(waitlist.size, { socket, userID });
}

function findOpenMatch() {
	if (waitlist.size === 0)
		return ([null, null]);

	const item = waitlist.entries().next();
	if (item.done)
		return ([null, null]);
	const [nr, userInfo] = item.value;
	waitlist.delete(nr);
	return ([userInfo.socket, userInfo.userID]);
}



function matchInterval(match) {
	match.intervalId = setInterval(() => {
		// if (match.stage == Stage.Init) {
		// 	initGame();
		// }
	}, 100)
}

// checks if there is already someone waiting
// if no -> make new match
// if so -> add second player to match and room and send msg back
export async function handleOnlineMatch(db, socket, userID, io) {
	const [socket2, userID2] = findOpenMatch();

	// if match is found, both are add to the room and get the msg to init the game + start
	if (socket2) {
		const matchID = createMatch(db, OT.Online, socket, userID, userID2);

		// add both players to the room
		socket.join(matchID);
		socket2.join(matchID);
		matches.get(matchID).stage = Stage.Init;

		const sockets = await io.in(matchID).allSockets();
		assert(sockets.size === 2, `Expected 2 sockets in match room, found ${sockets.size}`);

		// CREATE START VALUES FOR GAME HERE

		io.to(matchID).emit('message', {
			action: 'initOnlineGame',
			matchID: matchID,
			match: matches.get(matchID)
			// more info about the game
		});

		//set interval for online gamelogic
		matchInterval(matches.get(matchID));

	} else {
		console.log("No open match found...adding player to waitinglist");
		addToWaitinglist(socket, userID);
	}
}
