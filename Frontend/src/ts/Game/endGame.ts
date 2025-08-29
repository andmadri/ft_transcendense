import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { OT, state } from '@shared/enums'
import { submitLogout } from '../Auth/logout.js';
import { log } from '../logging.js';
import { styleElement } from '../Menu/menuContent.js';
import { game } from './gameLogic.js';
import { navigateTo } from "../history.js";

export function getGameOver() {
	log("Game Over!");
	const game = document.getElementById('game');
	if (game)
		game.remove();

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
	if (Game.match.player1.score > Game.match.player2.score) {
		result = "Left Player Wins!";
	} else if (Game.match.player1.score < Game.match.player2.score) {
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
	ball.style.top = '47.5%';
	ball.style.left = '47.5%';
	ball.style.width = '5%';
	ball.style.aspectRatio = '1 / 1';
	ball.style.backgroundColor = '#ededeb';
	ball.style.borderRadius = '50%';
	ball.style.boxShadow = '0.25rem 0.375rem 0.625rem';
	ball.style.animation = 'goX 2.2s linear 0s infinite alternate, goY 3.5s linear 0s infinite alternate';

	gameOver.appendChild(txtGameOver);
	gameOver.appendChild(txtInnerGameOver);
	gameOver.appendChild(ball);

	const backToMenu = document.createElement('button');
	backToMenu.id = 'menuBtn';
	backToMenu.textContent = 'Back to menu';
	backToMenu.style.fontFamily = '"Horizon", monospace';
	backToMenu.style.padding = '0.6rem 2rem';
	backToMenu.style.fontSize = '1.5rem';
	backToMenu.style.borderRadius = '0.8rem';
	backToMenu.style.border = '0.15rem solid black';
	backToMenu.style.backgroundColor = '#ededeb';
	backToMenu.style.boxShadow = '0.25rem 0.375rem 0.625rem rgba(0,0,0,0.3)';
	backToMenu.style.cursor = 'pointer';
	backToMenu.style.transition = 'all 0.2s ease-in-out';
	backToMenu.addEventListener('click', () => { navigateTo('Menu'); })
	gameOver.appendChild(backToMenu);

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.appendChild(gameOver);
}

export function saveGame() {
	if (Game.match.ID == -1)
		return ;

	
	Game.socket.send({
		action: 'game',
		subaction: 'save',
		matchID: Game.match.ID
	});

	if (Game.match.pauseTimeOutID) {
		clearTimeout(Game.match.pauseTimeOutID);
		Game.match.pauseTimeOutID = null;
	}
	
	Game.match.player1.score = 0;
	Game.match.player2.score = 0;
	Game.match.ID = -1;
	navigateTo('GameOver');
}