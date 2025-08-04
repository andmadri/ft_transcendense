import { updateBall, updatePadel, updateScore } from "./gameLogic.js";
import { createMatch, saveMatch, quitMatch } from './gameMatch.js';
import { matches } from './gameMatch.js';
import { findOpenMatch } from "./gameMatch.js";

export function handleGame(msg, socket, userId1, userId2) {
	if (!msg.subaction) {
		console.log('no subaction');
		return ;
	}

	if (msg.subaction == 'init' && msg.opponentMode != 3)
		return createMatch(msg, socket, userId1, userId2);
	else if (msg.subaction == 'init') {
		// create a match for online
		// how to stay searching? mainloop
		const msg = {
			action: 'game',
			subaction: 'init',
			stage: '',
			
		}
	
		const [roomID, match] = findOpenMatch();
		if (match) {
			match.roomID = roomID;
			match.player2.id = userId1;
			match.stage = Stage.playing;
			msg.stage = 'play';
			// send back opponent found to both... play
		} else {
			const MatchID = createMatch(msg, socket, userId1, 0); 
			// send back pending...
			msg.stage = 'pending';
			waitlist.set(MatchID, { match: match });
		}
		return ;
	}

	if (!msg.matchID) {
		console.log("No matchID found in msg from frontend");
		return ;
	}

	const match = matches.get(msg.matchID);
	if (!match) {
		return ;
	}

	switch (msg.subaction) {
		case 'ballUpdate':
			updateBall(match, msg, socket);
		case 'scoreUpdate':
			updateScore(match, msg, socket);
			break ;
		case 'padelUpdate':
			updatePadel(match, msg, socket);
		case 'save':
			return saveMatch(match, msg, socket);
		case 'quit':
			return quitMatch(match, msg, socket);
		default:
			console.log("subaction not found: " + msg.subaction);
	}
}