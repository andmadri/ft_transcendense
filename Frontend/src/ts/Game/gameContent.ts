import { log } from '../logging.js'
import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'

function styleElement(
	element: HTMLElement,
	width?: string,
	height?: string,
	position?: string,
	top?: string,
	right?: string,
	left?: string,
	backgroundColor?: string
) {
	if (width)
		element.style.width = width;
	if (height)
		element.style.height = height;
	if (position)
		element.style.position = position;
	if (top)
		element.style.top = top;
	if (right)
		element.style.right = right;
	if (left)
		element.style.left = left;
	if (backgroundColor)
		element.style.backgroundColor = backgroundColor;
}

function getQuitBtn() {
	const	quitButton = document.createElement('button');
	quitButton.id = 'quitButton';
	quitButton.textContent = 'Quit';
	quitButton.style.fontFamily = '"Horizon", monospace';
	quitButton.style.color = 'black';
	quitButton.style.background = 'transparent';
	quitButton.style.border = 'none';
	quitButton.style.fontSize = 'clamp(2rem, 5vh, 5rem)';
	quitButton.style.pointerEvents = 'auto';

	quitButton.addEventListener('click', () => {
		log("pushed quit button");
		Game.socket.send({
			action: 'game',
			subaction: 'quit',
			matchID: Game.match.ID,
			player: Game.match.player1.ID,
			name: Game.match.player1.name
		});
		UI.state = S.stateUI.Menu;
	})
	return (quitButton);
}


export function getGameField() {
	const optionMenu = document.getElementById('optionMenu');
	if (optionMenu) {
		const	app = document.getElementById("app");
		if (!app)
			return ;
		app.removeChild(optionMenu);
	}
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)'
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.overflow = 'hidden';

	const game = document.createElement('div');
	game.style.display = 'flex';
	game.style.flexDirection = 'column';
	game.id = 'game';
	game.style.width = '100%';
	game.style.height = '100%';
	game.style.position = 'relative';
	game.style.alignItems = 'center';
	game.style.textAlign = 'center';
	game.style.boxSizing = 'border-box';

	const scrollContainer = document.createElement('div');
	scrollContainer.style.display = 'inline-flex';
	scrollContainer.style.whiteSpace = 'nowrap';
	scrollContainer.style.overflow = 'hidden';
	scrollContainer.style.width = '100%';
	scrollContainer.style.position = 'relative';

	const title1 = document.createElement('div');
	title1.id = 'gameTitle';
	title1.textContent = 'PONG '.repeat(30);
	title1.style.fontFamily = '"Horizon", monospace';
	title1.style.fontSize = 'clamp(4rem, 8vh, 10rem)';
	title1.style.color = 'transparent';
	title1.style.webkitTextStroke = '0.2rem #000';
	title1.style.position = 'relative';
	title1.style.display = 'inline-block';
	title1.style.pointerEvents = 'none';
	title1.style.padding = '1rem';
	title1.style.animation = 'scrollTitle 35s linear infinite';

	const title2 = title1.cloneNode(true);

	scrollContainer.appendChild(title1);
	scrollContainer.appendChild(title2);

	const	field = document.createElement('div');
	field.id = 'field';
	field.style.aspectRatio = '4 / 3'
	field.style.width = 'calc(min(100vw, 100vh) - 2vw)'; //this will cause issues for remote games since 
	field.style.maxHeight = '80vh';
	field.style.backgroundColor = 'black';
	field.style.borderRadius = '16px';
	field.style.position = 'relative';
	field.style.border = '8px solid';
	field.style.boxSizing = 'border-box';

	const	ball = document.createElement('div');
	ball.id = 'ball';
	ball.style.position = 'absolute';
	ball.style.top = '50%';
	ball.style.left = '50%';
	ball.style.width = '5%';
	ball.style.aspectRatio = '1 / 1';
	ball.style.backgroundColor = '#ededeb';
	ball.style.borderRadius = '50%';
	ball.style.transform = 'translate(-50%, -50%)';

	const	lPlayer = document.createElement('div');
	lPlayer.id = 'lPlayer';
	lPlayer.style.position = 'absolute';
	lPlayer.style.left = '1%';
	lPlayer.style.top = '35%';
	lPlayer.style.width = '2%';
	lPlayer.style.aspectRatio = '1 / 7';
	lPlayer.style.borderRadius = '3px';
	lPlayer.style.backgroundColor = '#ededeb';
	
	const	rPlayer = document.createElement('div');
	rPlayer.id = 'rPlayer';
	rPlayer.style.position = 'absolute';
	rPlayer.style.right = '1%';
	rPlayer.style.top = '35%';
	rPlayer.style.width = '2%';
	rPlayer.style.aspectRatio = '1 / 7';
	rPlayer.style.borderRadius = '3px';
	rPlayer.style.backgroundColor = '#ededeb';

	const scoreContainer = document.createElement('div');
	scoreContainer.id = 'scoreContainer';
	scoreContainer.style.position = 'relative';
	scoreContainer.style.width = '100%';
	scoreContainer.style.height = '100%';
	scoreContainer.style.display = 'flex';
	scoreContainer.style.flexDirection = 'row';
	scoreContainer.style.justifyContent = 'space-around';

	const rightScore = document.createElement('div');
	rightScore.id = 'rightScore';
	rightScore.textContent = '0';
	rightScore.style.fontFamily = '"Horizon", monospace';
	rightScore.style.fontSize = '35vh';
	rightScore.style.color = '#FFC433';
	rightScore.style.opacity = '0.2';
	rightScore.style.alignContent = 'center';

	const leftScore = document.createElement('div');
	leftScore.id = 'leftScore';
	leftScore.textContent = '0';
	leftScore.style.fontFamily = '"Horizon", monospace';
	leftScore.style.fontSize = '35vh';
	leftScore.style.color = '#FF6117';
	leftScore.style.opacity = '0.2';
	leftScore.style.alignContent = 'center';

	scoreContainer.appendChild(leftScore);
	scoreContainer.appendChild(rightScore);


	field.appendChild(lPlayer);
	field.appendChild(rPlayer);
	field.appendChild(scoreContainer);
	field.appendChild(ball);

	game.appendChild(scrollContainer);
	game.appendChild(field);
	game.appendChild(getQuitBtn())
	body.append(game);
}
