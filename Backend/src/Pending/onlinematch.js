import { waitlist, matches } from "../InitGame/match.js";
import { OT, state } from '../SharedBuild/enums.js'
import { assert } from "console";
import { createMatch } from "../InitGame/match.js";
import { randomizeBallAngle, updateGameState, updatePaddlePos, resetBall } from "../SharedBuild/gameLogic.js";
import { sendGameStateUpdate, sendScoreUpdate, sendPadelHit, sendServe, updateMatchEventsDB } from "../Game/gameStateSync.js";
import { saveMatch } from "../End/endGame.js";

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

let now;
let deltaTime;

function matchInterval(match, io) {
	match.intervalID = setInterval(() => {
		now = performance.now();
		deltaTime = (now - match.lastUpdateTime) / 600;
		switch (match.state) {
			case (state.Init) : {
				if (match.pauseTimeOutID == null) {
					randomizeBallAngle(match.gameState.ball);
					match.resumeTime = Date.now() + 4000;
					console.log(`resumetime = ${match.resumeTime}`);
					match.pauseTimeOutID = setTimeout(() => {
						match.state = state.Playing;
						match.pauseTimeOutID = null
					}, match.resumeTime - Date.now());
				}
				break;
			}
			case (state.Playing) : {
				updateGameState(match, deltaTime);
				sendGameStateUpdate(match, io);
				break;
			}
			case (state.Paused) : {
				if (match.pauseTimeOutID == null) {
					match.resumeTime = match.gameState.time + 3000;
					match.pauseTimeOutID = setTimeout(() => {
						match.state = state.Serve;
						match.pauseTimeOutID = null
					}, match.resumeTime - Date.now());
				}
				updatePaddlePos(match.gameState.paddle1, match.gameState.field, deltaTime);
				updatePaddlePos(match.gameState.paddle2, match.gameState.field, deltaTime);
				break;
			}
			case (state.Serve) : {
				updateMatchEventsDB(match, null, match.gameState, "serve");
				// sendServe(match, io);
				match.state = state.Playing;
				break ;
			}
			case (state.Hit) : {
				updateMatchEventsDB(match, null, match.gameState, "hit");
				// sendPadelHit(match, io);
				match.state = state.Playing;
				break ;
			}
			case (state.Score) : {
				// console.log(`state.Score`);
				updateMatchEventsDB(match, null, match.gameState, "goal");
				resetBall(match.gameState.ball, match.gameState.field);
				sendScoreUpdate(match, io);
				match.state = state.Paused;
				break;
			}
			case (state.End) : {
				saveMatch(match, null, null);
				clearInterval(match.intervalID);
				break;
			}
		}
		match.lastUpdateTime = now;
		sendGameStateUpdate(match, io);
	}, 40)
}

export async function startOnlineMatch(db, socket1, socket2, userID1, userID2, io) {
	const matchID = await createMatch(db, OT.Online, socket1, userID1, userID2);

	if (matchID == -1) {
		console.log("CreateMatch went wrong");
		return ;
	}
	// add both players to the room
	socket1.join(matchID);
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
		${match.player1.ID} and ${match.player2.ID}`)

	io.to(matchID).emit('message', {
		action: 'initOnlineGame',
		matchID: matchID,
		match: match
		// more info about the game
	});

	//set interval for online gamelogic
	match.state = state.Init;
	matchInterval(match, io);
	return (matchID);
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

		startOnlineMatch(db, socket, socket2, userID, userID2, io);

	} else {
		console.log("No open match found...adding player to waitinglist");
		addToWaitinglist(socket, userID);
	}
}