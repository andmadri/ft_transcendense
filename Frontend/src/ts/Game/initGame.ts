import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'

export function startGame() {
	log('start Game?');
	switch (Game.opponentType) {
		case S.OT.ONEvsONE: {
			Game.state = S.State.Login;
			log("check here start gamE?");			
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
	if (option == '1 vs 1')
		Game.opponentType = S.OT.ONEvsONE;
	else if (option == '1 vs COM')
		Game.opponentType = S.OT.ONEvsCOM;
	else
		Game.opponentType = S.OT.Online;
}

export function changeMatchFormat(option: string) {
	if (option == 'single game')
		Game.matchFormat = S.MF.SingleGame;
	else
		Game.matchFormat = S.MF.Tournament;
}

// Get start position of ball
export function initPositions() {
	const ball = document.getElementById('ball');
	if (!ball)
		log('no ball');
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
		S.Objects['lPlayer'].height = playerTwo.clientHeight;
		S.Objects['lPlayer'].width = playerTwo.clientWidth;
		S.Objects['lPlayer'].y = playerTwo.offsetTop;
		S.Objects['lPlayer'].x = 0;
	} else {
		console.log('Something went wrong (initGame), close game?');
	}
}

export function initGameServer() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		if (Game.opponentType != S.OT.Online) {
			const initGame1 = {
				action: 'init',
				player: 'one',
				playerId: Game.id,
				playerName: Game.name,
			}
			Game.socket.send(JSON.stringify(initGame1));
		}
		if (Game.opponentType == S.OT.ONEvsONE) { // how to name??
			const initGame2 = {
				action: 'init',
				player: 'two',
				playerId: Game.id2,
				playerName: Game.name2,
			}
			Game.socket.send(JSON.stringify(initGame2));
		}
		else if (Game.opponentType == S.OT.ONEvsCOM) {
			const initGame2 = {
				action: 'init',
				player: 'two',
				playerId: -1,
				playerName: 'Computer',
			}
			Game.socket.send(JSON.stringify(initGame2));
		}
		else {
			const initGame = {
				action: 'init',
				player: 'one', // or two...decide by server?
				playerId: Game.id,
				playerName: Game.name,
			}
			Game.socket.send(JSON.stringify(initGame));
		}
	}
}
