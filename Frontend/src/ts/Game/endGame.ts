import { Game } from "../gameData.js"
import { log } from '../logging.js';
import { navigateTo } from "../history.js";
import { OT } from '@shared/enums'

let result = "";

export function getGameOver(opts?: { matchId?: number }) {
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

	// ADDED FOR CREATING IMAGE IN THE BACKEND - Commented this one line
	// gameOver.style.height = '100%';

	// gameOver.style.gap = '5%'

	const txtGameOver = document.createElement('div');
	txtGameOver.textContent = "Game Over";
	txtGameOver.style.color = 'transparent';
	txtGameOver.style.fontSize = '12rem';
	txtGameOver.style.webkitTextStroke = '0.2rem #000';

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

	const statsButton = document.createElement('button');
	statsButton.id = 'statsButton';
	statsButton.textContent = 'View Game Stats';
	statsButton.style.fontFamily = '"Horizon", monospace';
	statsButton.style.padding = '0.6rem 2rem';
	statsButton.style.fontSize = '1.5rem';
	statsButton.style.borderRadius = '0.8rem';
	statsButton.style.border = '0.15rem solid black';
	statsButton.style.backgroundColor = '#ededeb';
	statsButton.style.boxShadow = '0.25rem 0.375rem 0.625rem rgba(0,0,0,0.3)';
	statsButton.style.cursor = 'pointer';
	statsButton.style.transition = 'all 0.2s ease-in-out';
	statsButton.addEventListener('click', () => { 
		if (Number.isFinite(opts?.matchId)) {
			navigateTo('GameStats', { matchId: Number(opts?.matchId) });
		} else {
			console.warn('View Game Stats clicked but no matchId available');
		}
	});
	gameOver.appendChild(statsButton);

	const body = document.getElementById('body');
	if (!body)
		return ;
	// body.innerHTML = '';
	body.appendChild(gameOver);
}

export function saveGame() {
	if (Game.match.matchID == -1)
		return ;

	if ( Game.match.mode != OT.Online) {
		Game.socket.emit('message',{
			action: 'game',
			subaction: 'save',
			matchID: Game.match.matchID
		});
	}

	if (Game.match.pauseTimeOutID) {
		clearTimeout(Game.match.pauseTimeOutID);
		Game.match.pauseTimeOutID = null;
	}


	// Save the result to show in the GameOver function
	if (Game.match.player1.score > Game.match.player2.score)
		result = "Left Player Wins!";
	else if (Game.match.player1.score < Game.match.player2.score)
  		result = "Right Player Wins!"; 
	else
		result = "It is a Tie!"

	Game.match.player1.score = 0;
	Game.match.player2.score = 0;
	// Game.match.matchID = -1;

	navigateTo('GameOver', {matchId: Game.match.matchID});
	Game.match.matchID = -1;
}
