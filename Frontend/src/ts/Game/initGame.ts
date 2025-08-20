import * as S from '../structs'
import { Game, UI } from "../gameData.js"
import { log } from '../logging.js'
import { OT, state, MF } from '@shared/enums'
import { getGameField } from './gameContent.js';
import { randomizeBallAngle } from './gameLogic.js';
import { submitLogout } from '../Auth/logout.js';
import { styleElement } from '../Menu/menuContent.js';
import { initAfterResize } from '../windowEvents.js';

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
			log('No match format choosen');
			return ;
		}
	}
	
	switch (Game.match.mode) {
		case OT.ONEvsONE: {
			if (Game.match.player2.ID != -1) {
				UI.state = S.stateUI.Game;
				Game.match.state = state.Init;
			}
			else
				UI.state = S.stateUI.LoginP2;
			break ;
		}
		case OT.ONEvsCOM: {
			Game.match.player2.ID = 2; // Is not getting used - only for visability
			Game.match.player2.name = "AI"; // Is not getting used - only for visability
			UI.state = S.stateUI.Game;
			Game.match.state = state.Init;
			break ;
		}
		case OT.Online: {
			UI.state = S.stateUI.Game;
			Game.match.state = state.Pending;
			console.log("Send online request to backend");
			Game.socket.send({
				action: 'matchmaking',
				subaction: 'createOnlineMatch',
			});
			break ;
		}
		default: {
			alert('No opponent type choosen');
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
		default:
			log(`unknown match format? ${option}`);
	}
}

export function initPositions() {
	const fieldDiv = document.getElementById('field');
	const ballDiv = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	if (!ballDiv || !rPlayer || !lPlayer || !fieldDiv) {
		console.log('Something went wrong (initGame), close game?');
		return;
	}
	const fieldWidth = fieldDiv.clientWidth;
	const fieldHeight = fieldDiv.clientHeight;
	randomizeBallAngle();
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
		const app = document.getElementById('app');
		const startScreen = document.getElementById('startScreen')
		if (app && startScreen)
			app.removeChild(startScreen);
	}
}

// WHO VS WHO
function getStartScreenBeforeGame() {
	const app = document.getElementById('app');
	if (!app)
		return ;
	app.innerHTML = "";
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
	app.append(startScreen);
}

export function initGame() {
	initPositions();
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
	// updateNamesMenu();
	// resetScoreMenu();
}

export function actionInitOnlineGame(data: any) {
	const match = data.match;

	if (match == null) { // something went wrong
		alert('Could not start a new game');
		UI.state = S.stateUI.Menu;
	}
	getGameField();

	Game.match.player1.ID = match.player1.id;
	Game.match.player2.ID = match.player2.id;
	Game.match.player1.name = match.player1.name;
	Game.match.player2.name = match.player2.name;
	Game.match.ID = data.matchID;

	// Function to set all data sync with match in game...

	UI.state = S.stateUI.Game;
	console.log("Start online game...");
}