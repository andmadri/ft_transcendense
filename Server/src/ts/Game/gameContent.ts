import { log } from '../logging.js'
import { Game } from '../script.js'
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
	const	quiting = document.createElement('div');
	quiting.style.display = 'flex';
	const	quit = document.createElement('button');
	quit.id = 'quitBtn';
	quit.textContent = 'Exit';

	quit.addEventListener('click', () => {
		log("pushed quit button");
		Game.socket.send(JSON.stringify( {
			action: 'game',
			subaction: 'quit',
			matchID: Game.matchID,
			player: Game.id,
			name: Game.name
		}));
		Game.state = S.State.End;
	})
	quiting.appendChild(quit);
	return (quiting);
}

// export function getGameField() {
// 	const optionMenu = document.getElementById('optionMenu');
// 	if (optionMenu) {
// 		const	app = document.getElementById("app");
// 		if (!app)
// 			return ;
// 		app.removeChild(optionMenu);
// 	}
// 	const body = document.getElementById('body');
// 	if (!body)
// 		return ;
// 	body.style.height = "100%";
// 	body.style.width = "100%";
// 	body.style.padding = "10px";
// 	body.style.boxSizing = 'border-box';
// 	body.style.background = "linear-gradient(90deg, #ff6117, #ffc433, #ffc433)";
// 	body.style.justifyContent = "center";
// 	body.innerHTML = `
// 	<div class="scrollContainer">
// 		<div class="gameTitle" id="gameTitle">PongPongPongPongPongPongPongPongPong</div>
// 	</div>`;

// 	const gameContainer = document.createElement('div');
// 	gameContainer.id = 'game';
// 	gameContainer.className = 'gameContainer';
// 	gameContainer.innerHTML = `
// 	<div class="gameField" id="field">
// 		<div id="ball"></div>
// 		<div id="lPlayer"></div>
// 		<div id="rPlayer"></div>
// 	</div>
// 	`;
// 	body.appendChild(gameContainer);

// }


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

	// const scrollContainer = document.createElement('div');
	// scrollContainer.style.display = 'inline-flex';
	// scrollContainer.style.whiteSpace = 'nowrap';
	// scrollContainer.style.animation = 'scroll 20s linear infinite';

	const title1 = document.createElement('div');
	title1.id = 'gameTitle';
	title1.textContent = ' PONG PONG PONG PONG PONG PONG ';
	title1.style.position = 'relative';
	title1.style.fontFamily = '"Horizon", monospace';
	title1.style.fontSize = '4rem';
	title1.style.color = 'transparent';
	// title1.style.marginBottom = '2rem';
	title1.style.whiteSpace = 'nowrap';
	title1.style.webkitTextStroke = '0.2rem #000';
	title1.style.pointerEvents = 'none';

	// const title2 = title1.cloneNode(true);

	const	field = document.createElement('div');
	field.id = 'field';
	field.style.aspectRatio = '4 / 3'
	field.style.width = 'min(100vw, 100vh)';
	field.style.maxHeight = '80vh';
	field.style.backgroundColor = 'black';
	field.style.borderRadius = '16px';
	field.style.position = 'relative';
	field.style.border = '3px solid';
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
	rightScore.style.fontSize = '10rem';
	rightScore.style.color = '#rgb(255, 196, 51)';
	rightScore.style.opacity = '0.2';

	const leftScore = document.createElement('div');
	leftScore.id = 'leftScore';
	leftScore.textContent = '0';
	leftScore.style.fontFamily = '"Horizon", monospace';
	leftScore.style.fontSize = '10rem';
	leftScore.style.color = '#rgb(255, 97, 23)';
	leftScore.style.opacity = '0.2';

	scoreContainer.appendChild(leftScore);
	scoreContainer.appendChild(rightScore);


	field.appendChild(ball);
	field.appendChild(lPlayer);
	field.appendChild(rPlayer);
	field.appendChild(scoreContainer);
	// scrollContainer.appendChild(title2);
	// game.append(scrollContainer);
	game.appendChild(title1);
	game.append(field);
	body.append(game);
}
