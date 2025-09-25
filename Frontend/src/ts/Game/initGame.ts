import { Game, UI, newMatch } from "../gameData.js"
import { log } from '../logging.js'
import { OT, state, MF } from '@shared/enums'
import { randomizeBallAngle } from '@shared/gameLogic';
import { initAfterResize } from '../windowEvents.js';
import { navigateTo } from "../history.js";
import { customAlert } from '../Alerts/customAlert.js';



export function startGame() {
	console.log(`function startGame() ${Game.match.mode}`);
	switch (Game.match.matchFormat) {
		case MF.SingleGame: {
			break;
		}
		case MF.Tournament: {
			// create tournament once?
			break;
		}
		default: {
			customAlert("Please select single game or tournament"); //needed customAlert
			return;
		}
	}

	switch (Game.match.mode) {
		case OT.ONEvsONE: {
			if (Game.match.player2.ID != -1) {
				navigateTo('Game');
				Game.match.state = state.Init;
			}
			else {
				navigateTo('LoginP2');
			}
			break;
		}
		case OT.ONEvsCOM: {
			navigateTo('Game');
			Game.match.state = state.Init;
			break;
		}
		case OT.Online: {
			navigateTo('Game');
			Game.match.state = state.Pending;
			console.log("Send online request to backend");
			Game.socket.emit('message', {
				action: 'matchmaking',
				subaction: 'createOnlineMatch',
			});
			break;
		}
		default: {
			customAlert('Please select an opponent'); //needed customAlert
			return;
		}
	}
}

export function changeOpponentType(option: string) {
	switch (option) {
		case '1 vs 1':
			Game.match.mode = OT.ONEvsONE;
			break;
		case '1 vs COM':
			Game.match.mode = OT.ONEvsCOM;
			break;
		case 'Online':
			Game.match.mode = OT.Online;
			break;
		case 'Empty':
			Game.match.mode = OT.Empty;
			break;
		default:
			console.error('MSG_UNKNOWN_TYPE', 'Invalid message format', 'Unknown opponent:', option, 'changeOpponentType');
	}
}

export function changeMatchFormat(option: string) {
	// Game.match = newMatch();
	switch (option) {
		case 'single game':
			Game.match.matchFormat = MF.SingleGame;
			break;
		case 'tournament':
			Game.match.matchFormat = MF.Tournament;
			break;
		case 'Empty':
			Game.match.matchFormat = MF.Empty;
			break;
		default:
			console.error('MSG_UNKNOWN_FORMAT', 'Invalid message format', 'Unknown opponent:', option, 'changeMatchFormat');
	}
}

export function initGameServer() {
	if (Game.socket.connected) {
		log("server init")
		const initGame = {
			action: 'init',
			subaction: 'createMatch',
			player1ID: Game.match.player1.ID,
			player1Name: Game.match.player1.name,
			mode: Game.match.mode,
			player2ID: Game.match.player2.ID,
			player2Name: Game.match.player2.name
		}
		Game.socket.emit('message', initGame);
	}
}

export function initGame() {
	if (Game.match.mode != OT.Online) {
		Game.match.player1.ID = UI.user1.ID;
		Game.match.player1.name = UI.user1.name;
		console.log(`initGame() OT = ${Game.match.mode}`);
		if (Game.match.mode != OT.ONEvsCOM) {
			Game.match.player2.ID = UI.user2.ID;
			Game.match.player2.name = UI.user2.name;
		}
		else {
			Game.match.player2.ID = 2;
			Game.match.player2.name = "AI";
			console.log(`initGame() ${Game.match.player2.ID}`);
		}
		randomizeBallAngle(Game.match.gameState.ball);
		initGameServer();
	}
	// else {
	// 	// Send server msg that player is ready with init game
	// 	const readyToPlay = {
	// 		action: 'init',
	// 		subaction: 'start',
	// 		matchID: Game.match.matchID,
	// 		userID: UI.user1.ID //user check
	// 	}
	// 	Game.socket.emit('message',readyToPlay);
	// }
	const fieldDiv = document.getElementById('field');
	if (fieldDiv) {
		const resizeObserver = new ResizeObserver(() => {
			initAfterResize();
		})
		resizeObserver.observe(fieldDiv);
	}
	// updateNamesMenu();
	// resetScoreMenu();
}

export function actionInitOnlineGame(data: any) {
	const match = data.match;

	console.log("actionInitOnlineGame - matchID: " + data.matchID);
	if (match == null) { // something went wrong
		customAlert('Could not start a new game'); //needed customAlert
		navigateTo('Menu');
		return;
	}
	//getGameField();

	Game.match = match;
	console.log(`actionINitOnlineGame() MatchFormat = ${Game.match.matchFormat}`);
	// Function to set all data sync with match in game...

	navigateTo('Game'); //think we don't need this
	console.log("Start online game...");
}