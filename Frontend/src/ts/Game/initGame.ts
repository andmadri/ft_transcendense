import * as S from '../structs'
import { Game, UI } from "../gameData.js"
import { log } from '../logging.js'
import { OT, state, MF } from '@shared/enums'
import { randomizeBallAngle } from '@shared/gameLogic';
import { getGameField } from './gameContent.js';
import { submitLogout } from '../Auth/logout.js';
import { styleElement } from '../Menu/menuContent.js';
import { initAfterResize } from '../windowEvents.js';
import { navigateTo } from "../history.js";

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
			if (Game.match.player2.ID != -1) {
				navigateTo('Game');
				Game.match.state = state.Init;
			}
			else {
				navigateTo('LoginP2');
			}
			break ;
		}
		case OT.ONEvsCOM: {
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
			Game.socket.send({
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
		Game.socket.send(initGame);
	}
}

function readyStart(txt: HTMLDivElement) {
	log("Start button clicked");
	if (document.getElementById('startScreen')) {
		const body = document.getElementById('body');
		const startScreen = document.getElementById('startScreen')
		if (body && startScreen)
			body.removeChild(startScreen);
	}
}

function getStartScreenBeforeGame() {
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.innerHTML = "";
	const startScreen = document.createElement('div');
		startScreen.id = 'startScreen';
	styleElement(startScreen, {

	})
	const player1 = document.createElement('div');
	const player2 = document.createElement('div');
	const name1 = document.createElement('div');
	const name2 = document.createElement('div');
	const avatar1 = document.createElement('img');
	const avatar2 = document.createElement('img');
	const txt = document.createElement('div');
	const startBtn = document.createElement('button');

	name1.textContent = Game.match.player1.name;
	name2.textContent = Game.match.player2.name;
	avatar1.src = "./../images/avatar.png";
	styleElement(avatar1, {
		objectFit: 'contain',
	})
	avatar2.src = "./../images/avatar.png";
	styleElement(avatar2, {
		objectFit: 'contain',
	})
	player1.append(name1, avatar1);
	player2.append(name2, avatar2);
	txt.textContent = "Ready...?";
	startBtn.textContent = "START";
	startBtn.addEventListener('click', (e) => readyStart(txt));
	startScreen.append(player1, player2, txt, startBtn);
	body.append(startScreen);
}

export function initGame() {
	if (Game.match.mode != OT.Online)
		initGameServer();
	else {
		// Send server msg that player is ready with init game
		const readyToPlay = {
			action: 'init',
			subaction: 'start',
			matchID: Game.match.matchID,
			userID: Game.match.player1.ID
		}
		Game.socket.send(readyToPlay);
	}
	const fieldDiv = document.getElementById('field');
	if (fieldDiv) {
		const resizeObserver = new ResizeObserver(() => {
			initAfterResize();
		})
		resizeObserver.observe(fieldDiv);
	}
	randomizeBallAngle(Game.match.gameState.ball);
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
	getGameField();

	Game.match.player1.ID = match.player1.ID;
	Game.match.player2.ID = match.player2.ID;
	Game.match.player1.name = match.player1.name;
	Game.match.player2.name = match.player2.name;
	Game.match.ID = match.matchID;

	// Function to set all data sync with match in game...

	navigateTo('Game');
	console.log("Start online game...");
}