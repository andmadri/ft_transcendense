import * as S from '../structs'
import { E } from '../structs'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { getGameField } from './gameContent.js';
import { randomizeBallAngle } from './gameLogic.js';
import { submitLogout } from '../Auth/logout.js';
import { styleElement } from '../Menu/menuContent.js';



export function startGame() {
	switch (Game.opponentType) {
		case S.OT.ONEvsONE: {
			if (Game.player2Id != -1)
				Game.state = S.State.Init;
			else
				Game.state = S.State.LoginP2;
			break ;
		}
		case S.OT.ONEvsCOM: {
			Game.player2Id = 2; // Is not getting used - only for visability
			Game.player2Name = "AI"; // Is not getting used - only for visability
			Game.state = S.State.Init;
			break ;
		}
		case S.OT.Online: {
			Game.state = S.State.Pending;
			const msg = {
				action: 'matchmaking',
				subaction: 'createOnlineMatch',
			}
			Game.socket.send(JSON.stringify(msg));
			break ;
		}
		default: {
			log('No opponent type choosen');
			return ;
		}
	}

	switch (Game.matchFormat) {
		case S.MF.SingleGame: {
			break ;
		}
		case S.MF.Tournament: {
			// create tournament once?
			break ;
		}
		default: {
			log('No match format choosen');
			return ;
		}
	}
}

export function changeOpponentType(option: string) {
	switch (option) {
		case '1 vs 1':
			Game.opponentType = S.OT.ONEvsONE;
			break ;
		case '1 vs COM':
			Game.opponentType = S.OT.ONEvsCOM;
			break ;
		case 'Online':
			Game.opponentType = S.OT.Online;
			break ;
		default:
			log(`unknown opponent type? ${option}`);
	}
}

export function changeMatchFormat(option: string) {
	switch (option) {
		case 'single game':
			Game.matchFormat = S.MF.SingleGame;
			break ;
		case 'tournament':
			Game.matchFormat = S.MF.Tournament;
			break ;
		default:
			log(`unknown match format? ${option}`);
	}
}

function scaleToField(fieldDim: number, unit : number) : number {
	return (fieldDim * unit);
}

function initMovement() {
	const fieldSize = S.size[E.field];
	const fieldUnit = S.unitSize[E.field];

	randomizeBallAngle();

	for (const e of [E.ball, E.lPlayer, E.rPlayer]) {
		if (S.movement[e] && S.unitSize[e]) {
			S.movement[e].speed = scaleToField(fieldSize.width, S.unitMovement[e].speed);
		}
	}
}

function scaleGameSizes() {
	const fieldSize = S.size[E.field];
	const fieldUnit = S.unitSize[E.field];
	const ballSize = S.size[E.ball];

	fieldSize.width = window.innerWidth * 0.7;
	fieldSize.height = fieldSize.width * fieldUnit.height;

	for (const e of [E.ball, E.lPlayer, E.rPlayer]) {
		if (S.size[e] && S.unitSize[e]) {
			S.size[e].width = scaleToField(fieldSize.width, S.unitSize[e].width);
			if (e === E.ball) {
				S.size[e].height = S.size[e].width;
				continue ;
			}
			S.size[e].height = scaleToField(fieldSize.height, S.unitSize[e].height);
		}
	}
}

function scaleGamePos() {
	const fieldSize = S.size[E.field];

	for (const e of [E.ball, E.lPlayer, E.rPlayer]) {
		if (S.pos[e] && S.unitPos[e]) {
			S.pos[e].x = scaleToField(fieldSize.width, S.unitPos[e].x);
			S.pos[e].y = scaleToField(fieldSize.height, S.unitPos[e].y);
		}
	}
}

export function initDOMSizes() {
	const ballEl = document.getElementById('ball');
	const lPlayerEl = document.getElementById('rPlayer');
	const rPlayerEl = document.getElementById('lPlayer');
	const fieldEl = document.getElementById('field');
	const gameEl = document.getElementById('game');

	const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
	const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos} = S.pos;

	if (ballEl && lPlayerEl && rPlayerEl && fieldEl && gameEl)
	{
		// Size
		fieldEl.style.height = `${fieldSize.height}px`;
		fieldEl.style.width = `${fieldSize.width}px`;
		gameEl.style.height = `${fieldSize.height}px`;
		gameEl.style.width = `${fieldSize.width}px`;

		ballEl.style.height = `${ballSize.height}px`;
		ballEl.style.width = `${ballSize.width}px`;

		lPlayerEl.style.height = `${lPlayerSize.height}px`;
		lPlayerEl.style.width = `${lPlayerSize.width}px`;
		rPlayerEl.style.height = `${rPlayerSize.height}px`;
		rPlayerEl.style.width = `${rPlayerSize.width}px`;

		//Pos
		ballEl.style.left = `${ballPos.x - ballSize.width / 2}px`;
		ballEl.style.top = `${ballPos.y - ballSize.width / 2}px`;

		//lPlayerPos.y = lPlayerEl.offsetTop;
		rPlayerPos.x = lPlayerEl.offsetLeft;
		//lPlayerPos.y = rPlayerEl.offsetTop;
		rPlayerPos.x = fieldSize.width - rPlayerEl.offsetLeft;
	} else {
		console.log('Something went wrong (initGame), close game?');
	}
}

export function initGameServer() {
	if (Game.socket.connected) {
		log("server init")
		const initGame = {
			action: 'game',
			subaction: 'init',
			playerId: Game.player1Id,
			playerName: Game.player1Name,
			opponentMode: Game.opponentType,
			playerId2: Game.player2Id,
			playerName2: Game.player2Name
		}
		if (Game.opponentType == S.OT.ONEvsCOM)
			initGame.playerName2 = "Computer";
		Game.socket.send(JSON.stringify(initGame));
	}
}

function readyStart(txt: HTMLDivElement) {
	log("Start button clicked");
	if (document.getElementById('startScreen')) {
		const app = document.getElementById('app');
		const startScreen = document.getElementById('startScreen')
		if (app && startScreen)
			app.removeChild(startScreen);
		Game.playMode = true ;
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

	name1.textContent = Game.player1Name;
	name2.textContent = Game.player2Name;
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
	// if (document.getElementById('startScreen'))
	// 	return ;
	// getStartScreenBeforeGame();
	//getGameField();
	scaleGameSizes();
	scaleGamePos();
	initMovement();
	initDOMSizes();
	if (Game.opponentType != S.OT.Online)
		initGameServer();
	else {
		// Send server msg that player is ready with init game
		const readyToPlay = {
			action: 'game',
			subaction: 'start',
			matchID: Game.matchID,
			userID: Game.player1Id
		}
		Game.socket.send(JSON.stringify(readyToPlay));
	}
	// updateNamesMenu();
	// resetScoreMenu();
}

// export function saveGame() {
// 	log("Saving game...");
// 	log("Saving game: For id:" + Game.player1Id + " and id2: " + Game.player2Id);
// 	if (Game.opponentType == S.OT.ONEvsONE && Game.player2Id != 0)
// 	{
// 		log("Saving game and logout player 2");
// 		submitLogout(null, 2);
// 	}
// 	const saveGameMsg = {
// 		action: 'game',
// 		subaction: 'save',
// 		matchID: Game.matchID
// 	}
// 	Game.socket.send(JSON.stringify(saveGameMsg));

// 	Game.scoreLeft = 0;
// 	Game.scoreRight = 0;
// 	Game.matchID = -1;
// 	updateNamesMenu();
// 	resetScoreMenu();
// }