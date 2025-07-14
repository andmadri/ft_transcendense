import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { getGameField } from './gameContent.js';

export function startGame() {
	log('start Game?');
	// if (Game.opponentType == '1 vs 1') {
	// } else if (Game.opponentType == '1 vs COM') {
	// } else if (Game.opponentType == 'Online') {
	// } else {
	// 	log('No opponent type choosen');
	// 	return ;
	// }
	// if (Game.matchFormat == 'single game') {
	// } else if (Game.matchFormat == 'tournament') {
	// } else {
	// 	log('No match format choosen');
	// 	return ;
	// }
	Game.opponentType = 'ai';
	Game.gameOn = true ;
}

export function changeOpponentType(option: string) {
	Game.opponentType = option;
}

export function changeMatchFormat(option: string) {
	Game.matchFormat = option;
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
