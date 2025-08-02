import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { getGameField } from './gameContent.js';
import { updateNamesMenu, resetScoreMenu } from '../SideMenu/SideMenuContent.js';

export function startGame() {
	switch (Game.opponentType) {
		case S.OT.ONEvsONE: {
			Game.state = S.State.Login;		
			break ;
		}
		case S.OT.ONEvsCOM: {
			Game.state = S.State.Game;
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
		case S.MF.Tournament: {
			// create tournament once?
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
	log('Game state after startGame: ' + Game.state);
}

export function changeOpponentType(option: string) {
	switch (option) {
		case '1 vs 1':
			Game.opponentType = S.OT.ONEvsONE;
			break ;
		case '1 vs COM':
			Game.opponentType = S.OT.ONEvsCOM;
			break ;
		case 'online':
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
// export function initPositions() {
// 	const ball = document.getElementById('ball');
// 	const playerOne = document.getElementById('rPlayer');
// 	const playerTwo = document.getElementById('lPlayer');
// 	const field = document.getElementById('field');
// 	const game = document.getElementById('game');

// 	if (ball && playerOne && playerTwo && field && game)
// 	{
// 		// Field
// 		S.Objects['field'].width = window.innerWidth * 0.7;
// 		S.Objects['field'].height = S.Objects['field'].width * 0.7;

// 		field.style.height = `${S.Objects['field'].height}px`;
// 		field.style.width = `${S.Objects['field'].width}px`;
// 		game.style.height = `${S.Objects['field'].height}px`;
// 		game.style.width = `${S.Objects['field'].width}px`;

// 		// Ball
// 		const ballSize = S.Objects['field'].width * 0.05;
// 		ball.style.height = `${ballSize}px`;
// 		ball.style.width = `${ballSize}px`;
// 		S.Objects['ball'].height = ballSize;
// 		S.Objects['ball'].width = ballSize;
// 		S.Objects['ball'].x = field.clientWidth / 2;
// 		S.Objects['ball'].y = field.clientHeight / 2;
// 		S.Objects['ball'].speed = field.clientWidth * 0.015;
// 		ball.style.left = `${S.Objects['ball'].x - ballSize / 2}px`;
// 		ball.style.top = `${S.Objects['ball'].y - ballSize / 2}px`;

// 		// Players
// 		playerOne.style.height = `${S.Objects['field'].height * 0.30}px`;
// 		playerTwo.style.height = `${S.Objects['field'].height * 0.30}px`;
// 		playerOne.style.width = `${S.Objects['field'].width * 0.02}px`;
// 		playerTwo.style.width = `${S.Objects['field'].width * 0.02}px`;
// 		S.Objects['rPlayer'].height = playerOne.clientHeight;
// 		S.Objects['rPlayer'].width = playerOne.clientWidth;
// 		S.Objects['rPlayer'].y = playerOne.offsetTop;
// 		S.Objects['rPlayer'].x = playerOne.offsetLeft;
// 		S.Objects['rPlayer'].speed = field.clientHeight * 0.03;
// 		S.Objects['lPlayer'].height = playerTwo.clientHeight;
// 		S.Objects['lPlayer'].width = playerTwo.clientWidth;
// 		S.Objects['lPlayer'].y = playerTwo.offsetTop;
// 		S.Objects['lPlayer'].x = playerTwo.offsetLeft;
// 		S.Objects['lPlayer'].speed = field.clientHeight * 0.03;
// 	} else {
// 		console.log('Something went wrong (initGame), close game?');
// 	}
// }

export function initGameSizes() {
	const { field, ball, paddle } = S.gameScreenPixels;
	const { field: fieldUnit, ball: ballUnit, paddle: paddleUnit } = S.unitGameSizes;

	field.width = window.innerWidth * 0.7;
	field.height = field.width * fieldUnit.height;

	ball.radius = field.width * ballUnit.radius;
	ball.speed = field.width * ballUnit.speed;

	paddle.width = field.width * paddleUnit.width;
	paddle.height = field.height * paddleUnit.height;
	paddle.speed = field.height * paddleUnit.speed;
}

export function initGamePos() {
	const { field, ball, paddle } = S.gameScreenPixels;
	const { ball: ballUnit, lPlayer: lPlayerUnit, rPlayer: rPlayerUnit } = S.unitGamePos;
	const { ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos } = S.gamePos;

	ballPos.x = field.width * ballUnit.x;
	ballPos.y = field.height * ballUnit.y;

	lPlayerPos.x = field.width * lPlayerUnit.x;
	lPlayerPos.y = field.height * lPlayerUnit.y;

	rPlayerPos.x = field.width * rPlayerUnit.x;
	rPlayerPos.y = field.height * rPlayerUnit.y;
}

export function initDOMSizes() {
	const ballEl = document.getElementById('ball');
	const lPlayerEl = document.getElementById('rPlayer');
	const rPlayerEl = document.getElementById('lPlayer');
	const fieldEl = document.getElementById('field');
	const gameEl = document.getElementById('game');

	const { field: fieldSize, ball: ballSize, paddle: paddleSize } = S.gameScreenPixels;
	const { ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos} = S.gamePos;

	if (ballEl && lPlayerEl && rPlayerEl && fieldEl && gameEl)
	{
		// Size
		fieldEl.style.height = `${fieldSize.height}px`;
		fieldEl.style.width = `${fieldSize.width}px`;
		gameEl.style.height = `${fieldSize.height}px`;
		gameEl.style.width = `${fieldSize.width}px`;

		ballEl.style.height = `${ballSize.radius * 2}px`;
		ballEl.style.width = `${ballSize.radius * 2}px`;

		lPlayerEl.style.height = `${paddleSize.height}px`;
		lPlayerEl.style.width = `${paddleSize.width}px`;
		rPlayerEl.style.height = `${paddleSize.height}px`;
		rPlayerEl.style.width = `${paddleSize.width}px`;

		//Pos
		ballEl.style.left = `${ballPos.x - ballSize.radius}px`;
		ballEl.style.top = `${ballPos.y - ballSize.radius}px`;

		lPlayerPos.y = lPlayerEl.offsetTop;
		rPlayerPos.x = lPlayerEl.offsetLeft;
		lPlayerPos.y = rPlayerEl.offsetTop;
		rPlayerPos.x = rPlayerEl.offsetLeft;
	} else {
		console.log('Something went wrong (initGame), close game?');
	}
}

export function initGameServer() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		if (Game.opponentType != S.OT.Online) {
			const initGame1 = {
				action: 'game',
				subaction: 'init',
				player: 'one',
				playerId: Game.id,
				playerName: Game.name,
			}
			Game.socket.send(JSON.stringify(initGame1));
		}
		if (Game.opponentType == S.OT.ONEvsONE) {
			const initGame2 = {
				action: 'game',
				subaction: 'init',
				player: 'two',
				playerId: Game.id2,
				playerName: Game.name2,
			}
			Game.socket.send(JSON.stringify(initGame2));
		}
		else if (Game.opponentType == S.OT.ONEvsCOM) {
			const initGame2 = {
				action: 'game',
				subaction: 'init',
				player: 'two',
				playerId: -1,
				playerName: 'Computer',
			}
			Game.socket.send(JSON.stringify(initGame2));
		}
		else {
			const initGame = {
				action: 'game',
				subaction: 'init',
				player: 'one', // or two...decide by server?
				playerId: Game.id,
				playerName: Game.name,
			}
			Game.socket.send(JSON.stringify(initGame));
		}
	}
}

export function initGame() {
	getGameField();
	initGameSizes();
	initGamePos();
	initDOMSizes();
	initGameServer();
	updateNamesMenu();
	resetScoreMenu();
}
