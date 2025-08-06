import { Game } from '../script.js'
import * as S from '../structs.js'
import { submitLogout } from '../Auth/logout.js';
import { log } from '../logging.js';
import { styleElement } from '../Menu/menuContent.js';

function handleGameOver() {
	log("Game Over!");

	const gameOver = document.createElement('div');
	styleElement(gameOver, {
		position: 'absolute',
		top: '30%',
		left: '50%',
		transform: 'translateX(-50%)',
		padding: '20px',
		backgroundColor: 'black',
		color: 'white',
		fontSize: '2rem',
		textAlign: 'center',
		borderRadius: '10px',
		width: '80%',
		maxWidth: '500px',
	});
	gameOver.id = 'gameOver';

	const txtGameOver = document.createElement('h1');
	txtGameOver.style.color = 'white';
	txtGameOver.textContent = "Game Over!";

	const txtInnerGameOver = document.createElement('p');
	txtInnerGameOver.style.color = 'white';
	txtInnerGameOver.textContent = `
	${Game.scoreLeft > Game.scoreRight ? "Left Player Wins!" : "Right Player Wins!"}`;
	gameOver.append(txtGameOver, txtInnerGameOver);

	const	backToMenu = document.createElement('button');
	backToMenu.id = 'menuBtn';
	backToMenu.textContent = 'Back to menu';

	backToMenu.addEventListener('click', () => {
		log("pushed back to menu button");
		Game.state = S.State.Menu;
		return ;
	})
	const app = document.getElementById('app');
	if (!app)
		return ;
	app.innerHTML = "";
	app.append(gameOver, backToMenu);
	Game.state = S.State.End;
}

export function saveGame() {
	if (Game.matchID == -1)
		return ;

	if (!document.getElementById('gameOver'))
		handleGameOver();

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
	if (Game.opponentType == S.OT.ONEvsONE && Game.player2Id != 0) {
		submitLogout(null, 2);
	} else {
		Game.player2Id = -1;
		Game.player2Name = 'unknown';
	}
}