
import { waitlist, matches } from "../InitGame/match.js";
import { OT, state } from '../SharedBuild/enums.js'
import { assert } from "console";
import { createMatch } from "../InitGame/match.js";

async function addToWaitinglist(socket, userID) {
	console.log(`Add ${userID} to waiting list`);
	waitlist.set(waitlist.size, { socket, userID });
}

export async function removeFromWaitinglist(userID) {
	for (const [nr, userInfo] of waitlist) {
		if (userInfo.userID == userID) {
			waitlist.delete(nr);
			console.log(`Removed ${userID} from waiting list`);
			return ;
		}
	}
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
		// if (match.stage == state.Init) {
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
		if (userID2 && userID2 == userID) {
			console.log('Player can not play against himself');
			socket.emit('message', {
				action: 'initOnlineGame',
				match: null
				// more info about the game
			});
		return ;
		}
	
		const matchID = await createMatch(db, OT.Online, socket, userID, userID2);

		if (matchID == -1) {
			console.log("CreateMatch went wrong");
			return ;
		}
		// add both players to the room
		socket.join(matchID);
		socket2.join(matchID);
		// matches.get(matchID).stage = state.Init;

		const sockets = await io.in(matchID).allSockets();
		assert(sockets.size === 2, `Expected 2 sockets in match room, found ${sockets.size}`);

		// CREATE START VALUES FOR GAME HERE
		const match = matches.get(matchID);
		if (!match) {
			console.log(`Something went wrong!!! No match for matchID: ${matchID}`);
			return ;
		}
		console.log(`handleOnlineMatch: ${matchID}:
			${match.player1.id} and ${match.player2.id}`)

		io.to(matchID).emit('message', {
			action: 'initOnlineGame',
			matchID: matchID,
			match: match
			// more info about the game
		});

		//set interval for online gamelogic
		matchInterval(match);

	} else {
		console.log("No open match found...adding player to waitinglist");
		addToWaitinglist(socket, userID);
	}
}
