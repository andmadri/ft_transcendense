import * as S from '../structs'
import { Game, UI, newMatch } from "../gameData.js"
import { log } from '../logging.js'
import { OT, state, MF } from '@shared/enums'
import { randomizeBallAngle } from '@shared/gameLogic';
import { getGameField } from './gameContent.js';
import { submitLogout } from '../Auth/logout.js';
// import { styleElement } from '../Menu/menuContent.js';
import { initAfterResize } from '../windowEvents.js';
import { navigateTo } from "../history.js";
import { startGameField } from './startGameContent.js';

const field = Game.match.gameState.field;
const ball = Game.match.gameState.ball;
const paddle1 = Game.match.gameState.paddle1;
const paddle2 = Game.match.gameState.paddle2;

export function startGame() {
	console.log(`function startGame() ${Game.match.mode}`);
	switch (Game.match.matchFormat) {
		case MF.SingleGame: {
			break ;
		}
		case MF.Tournament: {
			// create tournament once?
			break ;
		}
		default: {
			alert("Please select single game or tournament");
			return ;
		}
	}
	
	switch (Game.match.mode) {
		case OT.ONEvsONE: {
			if (Game.match.player2.ID != -1) { // Check this!
				navigateTo('Game');
				Game.match.state = state.Init;
			}
			else {
				navigateTo('LoginP2');
			}
			break ;
		}
		case OT.ONEvsCOM: { // Check this!
			Game.match.player2.ID = 2; // Is not getting used - only for visability
			Game.match.player2.name = "AI"; // Is not getting used - only for visability
			navigateTo('Game');
			Game.match.state = state.Init;
			break ;
		}
		case OT.Online: {
			navigateTo('Game');
			Game.match.state = state.Pending;
			console.log("Send online request to backend");
			Game.socket.emit('message',{
				action: 'matchmaking',
				subaction: 'createOnlineMatch',
			});
			break ;
		}
		default: {
			alert('Please select an opponent');
			return ;
		}
	}
}

export function changeOpponentType(option: string) {
	switch (option) {
		case '1 vs 1':
			Game.match.mode = OT.ONEvsONE;
			break ;
		case '1 vs COM':
			Game.match.mode = OT.ONEvsCOM;
			break ;
		case 'Online':
			Game.match.mode = OT.Online;
			break ;
		case 'empty':
			Game.match.mode = OT.Empty;
		default:
			log(`unknown opponent type? ${option}`);
	}
}

export function changeMatchFormat(option: string) {
	switch (option) {
		case 'single game':
			Game.match.matchFormat = MF.SingleGame;
			break ;
		case 'tournament':
			Game.match.matchFormat = MF.Tournament;
			break ;
		case 'empty':
			Game.match.matchFormat = MF.Empty;
		default:
			log(`unknown match format? ${option}`);
	}
}

export function initGameServer() {
	if (Game.socket.connected) {
		log("server init")
		const initGame = {
			action: 'init',
			subaction: 'createMatch',
			playerId: Game.match.player1.ID,
			playerName: Game.match.player1.name,
			mode: Game.match.mode,
			playerId2: Game.match.player2.ID,
			playerName2: Game.match.player2.name
		}
		if (Game.match.mode == OT.ONEvsCOM)
			initGame.playerName2 = "Computer";
		Game.socket.emit('message',initGame);
	}
}

export function initGame() {
	if (Game.match.mode != OT.Online) {
		Game.match.player1.ID = UI.user1.ID;
		Game.match.player1.name = UI.user1.name;
		if (Game.match.mode != OT.ONEvsCOM) {
			Game.match.player2.ID = UI.user2.ID;
			Game.match.player2.name = UI.user2.name;
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

	if (match == null) { // something went wrong
		alert('Could not start a new game');
		navigateTo('Menu');
		return ;
	}
	//getGameField();

	Game.match = match;
	// Function to set all data sync with match in game...

	navigateTo('Game'); //think we don't need this
	console.log("Start online game...");
}