import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { updateNamesMenu, resetScoreMenu } from '../SideMenu/SideMenuContent.js'
import { submitLogout } from '../Auth/logout.js';

export function startGame() {
	switch (Game.opponentType) {
		case S.OT.ONEvsONE: {
			Game.state = S.State.Login2;
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
	const field = document.getElementById('field');
	const ball = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	// const game = document.getElementById('game');
	if (!ball || !rPlayer || !lPlayer || !field) {
		console.log('Something went wrong (initGame), close game?');
		return;
	}
		// Field
	const fieldWidth = field.clientWidth;
	const fieldHeight = field.clientHeight;

	S.Objects['field'].width = fieldWidth;
	S.Objects['field'].height = fieldHeight;

	// field.style.height = `${S.Objects['field'].height}px`;
	// field.style.width = `${S.Objects['field'].width}px`;
	// game.style.height = `${S.Objects['field'].height}px`;
	// game.style.width = `${S.Objects['field'].width}px`;

	// Ball
	// const ballSize = ball.clientWidth;
	// ball.style.height = `${ballSize}px`;
	// ball.style.width = `${ballSize}px`;
	S.Objects['ball'].width =  ball.clientWidth;
	S.Objects['ball'].height = ball.clientHeight;

	S.Objects['ball'].x = fieldWidth / 2;
	S.Objects['ball'].y = fieldHeight / 2;
	S.Objects['ball'].speed = fieldWidth * 0.01;
	// ball.style.left = `${S.Objects['ball'].x - ballSize / 2}px`;
	// ball.style.top = `${S.Objects['ball'].y - ballSize / 2}px`;

	// Players
	// rPlayer.style.height = `${S.Objects['field'].height * 0.30}px`;
	// lPlayer.style.height = `${S.Objects['field'].height * 0.30}px`;
	// rPlayer.style.width = `${S.Objects['field'].width * 0.02}px`;
	// lPlayer.style.width = `${S.Objects['field'].width * 0.02}px`;
	S.Objects['rPlayer'].height = rPlayer.clientHeight;
	S.Objects['rPlayer'].width = rPlayer.clientWidth;
	S.Objects['rPlayer'].y = rPlayer.offsetTop;
	S.Objects['rPlayer'].x = rPlayer.offsetLeft;
	S.Objects['rPlayer'].speed = fieldHeight * 0.015;

	S.Objects['lPlayer'].height = lPlayer.clientHeight;
	S.Objects['lPlayer'].width = lPlayer.clientWidth;
	S.Objects['lPlayer'].y = lPlayer.offsetTop;
	S.Objects['lPlayer'].x = lPlayer.offsetLeft;
	S.Objects['lPlayer'].speed = fieldHeight * 0.015;
}

export function initGameServer() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		log("server init")
		const initGame = {
			action: 'game',
			subaction: 'init',
			playerId: Game.id,
			playerName: Game.name,
			opponentMode: Game.opponentType,
			playerId2: Game.id2,
			playerName2: Game.name2
		}
		if (Game.opponentType == S.OT.ONEvsCOM)
			initGame.playerName2 = "Computer";
		Game.socket.send(JSON.stringify(initGame));
	}
}

export function initGame() {
	initPositions();
	initGameServer();
	// updateNamesMenu();
	// resetScoreMenu();
}

// export function saveGame() {
// 	log("Saving game...");
// 	log("Saving game: For id:" + Game.id + " and id2: " + Game.id2);
// 	if (Game.opponentType == S.OT.ONEvsONE && Game.id2 != 0)
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
