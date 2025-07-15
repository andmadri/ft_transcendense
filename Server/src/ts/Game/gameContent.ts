import { log } from '../logging.js'

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

function removeLogDiv() {
	const logDiv = document.getElementById('log');
	logDiv?.remove();
}

export function getGameField() {
	removeLogDiv();

	const	body = document.body;
	body.style.margin = '0';
	body.style.padding = '0';
	body.style.backgroundColor = 'gold';


	const	game = document.createElement('div');
	game.id = 'game';
	styleElement(game, '100vw', '100vh', 'relative', '', '', '', 'gold');
	game.style.display = 'flex';
	game.style.justifyContent = 'center';
	game.style.alignItems = 'center';
	game.style.padding = '10px';
	game.style.boxSizing = 'border-box';
	game.style.gap = '20px';

	body.appendChild(game);

	const title = document.createElement('div');
	title.id = 'gameTitle';
	title.textContent = 'PONG';
	title.style.position = 'absolute';
	title.style.fontFamily = '"Courier New", monospace';
	title.style.fontSize = '2rem';
	title.style.color = 'black';
	title.style.zIndex = '5';
	title.style.pointerEvents = 'none';
	
	const	field = document.createElement('div');
	field.id = 'field';
	styleElement(field, '95%', '80%', 'relative', '', '', '', 'black');
	field.style.borderRadius = '20px';
	field.style.overflow = 'hidden';
	field.style.position = 'relative';
	
	const	ball = document.createElement('div');
	ball.id = 'ball';
	styleElement(ball, '25px', '25px', 'absolute', '50%', '', '50%', 'white');
	ball.style.borderRadius = '50%';
	ball.style.transform = 'translate(-50%, -50%)';
	
	const	lPlayer = document.createElement('div');
	lPlayer.id = 'lPlayer';
	styleElement(lPlayer, '10px', '100px', 'absolute', '300px', '', '10px', 'white');

	const	rPlayer = document.createElement('div');
	rPlayer.id = 'rPlayer';
	styleElement(rPlayer, '10px', '100px', 'absolute', '300px', '10px', '', 'white');
	
	field.appendChild(ball);
	field.appendChild(lPlayer);
	field.appendChild(rPlayer);
	game.appendChild(title);
	game.appendChild(field);
}


export function removeGameField() {
	const	body = document.getElementById('body');
	const	game = document.getElementById('game');

	if (body && game)
		body.removeChild(game);
}
