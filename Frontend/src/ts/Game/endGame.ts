import { Game } from '../script.js'
import * as S from '../structs.js'
import { OT } from '@shared/OT'
import { submitLogout } from '../Auth/logout.js';
import { log } from '../logging.js';
import { styleElement } from '../Menu/menuContent.js';
import { game } from './gameLogic.js';

function handleGameOver() {
	log("Game Over!");

	const gameOver = document.createElement('div');
	gameOver.id = 'gameOver';
	gameOver.style.display = 'flex';
	gameOver.style.flexDirection = 'column';
	gameOver.style.alignItems = 'center';
	gameOver.style.justifyContent = 'center';
	gameOver.style.position = 'relative';
	gameOver.style.backgroundColor = 'transparent';
	gameOver.style.fontFamily = '"Horizon", monospace';
	gameOver.style.textAlign = 'center';
	gameOver.style.width = '100%';
	gameOver.style.height = '100%';
	// gameOver.style.gap = '5%'

	const txtGameOver = document.createElement('div');
	txtGameOver.textContent = "Game Over";
	txtGameOver.style.color = 'transparent';
	txtGameOver.style.fontSize = '12rem';
	txtGameOver.style.webkitTextStroke = '0.2rem #000';

	let result;
	if (Game.scoreLeft > Game.scoreRight) {
		result = "Left Player Wins!";
	} else if (Game.scoreLeft < Game.scoreRight) {
  result = "Right Player Wins!"; 
	} else {
		result = "It is a Tie!"
	}

	const txtInnerGameOver = document.createElement('div');
	txtInnerGameOver.textContent = `${result}`;
	txtInnerGameOver.style.color = 'black';
	txtInnerGameOver.style.fontSize = '3rem';

	const	ball = document.createElement('div');
	ball.id = 'ballEndCredits';
	ball.style.position = 'absolute';
	ball.style.top = '50%';
	ball.style.left = '50%';
	ball.style.width = '5%';
	ball.style.aspectRatio = '1 / 1';
	ball.style.backgroundColor = '#ededeb';
	ball.style.borderRadius = '50%';
	ball.style.boxShadow = '0.25rem 0.375rem 0.625rem';
	ball.style.animation = 'goX 2.2s linear 0s infinite alternate, goY 3.5s linear 0s infinite alternate';

	gameOver.appendChild(txtGameOver);
	gameOver.appendChild(txtInnerGameOver);
	gameOver.appendChild(ball);

		// ball.style.transform = 'translate(-50%, -50%)';

	// const	backToMenu = document.createElement('button');
	// backToMenu.id = 'menuBtn';
	// backToMenu.textContent = 'Back to menu';

	// backToMenu.addEventListener('click', () => {
	// 	log("pushed back to menu button");
	// 	Game.state = S.State.Menu;
	// 	return ;
	// })

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.appendChild(gameOver);
	Game.state = S.State.End;
}

export function saveGame() {
	if (Game.matchID == -1)
		return ;

	if (!document.getElementById('gameOver'))
	{
		const game = document.getElementById('game');
		if (game)
			game.remove();
		handleGameOver();
	}

	// MARTY HERE!!! - Is this the place where we can change the data of the message?
	const saveGameMsg = {
		action: 'game',
		subaction: 'save',
		matchID: Game.matchID
	}
	Game.socket.send(JSON.stringify(saveGameMsg));

	Game.scoreLeft = 0;
	Game.scoreRight = 0;
	Game.matchID = -1;

	// LOGOUT PLAYER 2 after game ONE vs ONE
	if (Game.opponentType == OT.ONEvsONE && Game.player2Id != 0) {
		submitLogout(null, 2);
	} else {
		Game.player2Id = -1;
		Game.player2Name = 'unknown';
	}
}