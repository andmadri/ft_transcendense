import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
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
			Game.state = S.State.Init;
			break ;
		}
		case S.OT.Online: {
			Game.state = S.State.Pending;
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

// Get start position of ball
export function initPositions() {
	const ball = document.getElementById('ball');
	const playerOne = document.getElementById('rPlayer');
	const playerTwo = document.getElementById('lPlayer');
	const field = document.getElementById('field');
	const game = document.getElementById('game');

	if (ball && playerOne && playerTwo && field && game)
	{
		// Field
		S.Objects['field'].width = window.innerWidth * 0.7;
		S.Objects['field'].height = S.Objects['field'].width * (7 / 10);
		field.style.height = `${S.Objects['field'].height}px`;
		field.style.width = `${S.Objects['field'].width}px`;
		game.style.height = `${S.Objects['field'].height}px`;
		game.style.width = `${S.Objects['field'].width}px`;

		// Ball
		const ballSize = S.Objects['field'].width * 0.05;
		ball.style.height = `${ballSize}px`;
		ball.style.width = `${ballSize}px`;
		S.Objects['ball'].height = ballSize;
		S.Objects['ball'].width = ballSize;
		S.Objects['ball'].x = field.clientWidth / 2;
		S.Objects['ball'].y = field.clientHeight / 2;
		S.Objects['ball'].speed = field.clientWidth * 0.01;
		ball.style.left = `${S.Objects['ball'].x - ballSize / 2}px`;
		ball.style.top = `${S.Objects['ball'].y - ballSize / 2}px`;

		// Players
		playerOne.style.height = `${S.Objects['field'].height * 0.30}px`;
		playerTwo.style.height = `${S.Objects['field'].height * 0.30}px`;
		playerOne.style.width = `${S.Objects['field'].width * 0.02}px`;
		playerTwo.style.width = `${S.Objects['field'].width * 0.02}px`;
		S.Objects['rPlayer'].height = playerOne.clientHeight;
		S.Objects['rPlayer'].width = playerOne.clientWidth;
		S.Objects['rPlayer'].y = playerOne.offsetTop;
		S.Objects['rPlayer'].x = playerOne.offsetLeft;
		S.Objects['rPlayer'].speed = field.clientHeight * 0.015;
		S.Objects['lPlayer'].height = playerTwo.clientHeight;
		S.Objects['lPlayer'].width = playerTwo.clientWidth;
		S.Objects['lPlayer'].y = playerTwo.offsetTop;
		S.Objects['lPlayer'].x = playerTwo.offsetLeft;
		S.Objects['lPlayer'].speed = field.clientHeight * 0.015;
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
	initPositions();
	initGameServer();
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
