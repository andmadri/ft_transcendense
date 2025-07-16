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
	body.style.display = 'grid';
	body.style.placeItems = 'center';

	//wrapper for title and field
	const container = document.createElement('div');
	container.style.display = 'flex';
	container.style.flexDirection = 'column';
	container.style.alignItems = 'center'; // center horizontally
	container.style.gap = '20px'; // spacing between title and field
	container.style.flexShrink = '0';
	

	const	game = document.createElement('div');
	game.style.display = 'flex';
	game.style.flexDirection = 'column';
	game.id = 'game';
	styleElement(game, '100vw', '100vh', 'relative', '', '', '', 'gold');
	game.style.alignItems = 'center';
	game.style.padding = '10px';
	game.style.boxSizing = 'border-box';
	game.style.gap = '20px';
	game.style.textAlign = 'center';
	

	const title = document.createElement('div');
	title.id = 'gameTitle';
	title.textContent = 'PONG';
	title.style.position = 'relative';
	title.style.fontFamily = '"Courier New", monospace';
	title.style.fontSize = '3rem';
	title.style.color = 'gold';
	title.style.textShadow = `	-2px -2px 0 black,
	2px -2px 0 black,
	-2px  2px 0 black,
	2px  2px 0 black	`;
	title.style.zIndex = '5';
	title.style.pointerEvents = 'none';
	
	const	field = document.createElement('div');
	field.id = 'field';
	styleElement(field, '800px', '600px', 'relative', '', '', '', 'black');
	field.style.border = '30px solid black'; //maybe this will fuck up collision and scaling
	field.style.borderRadius = '30px';
	//field.style.padding = '30px';
	field.style.position = 'relative';
	
	const	ball = document.createElement('div');
	ball.id = 'ball';
	styleElement(ball, '25px', '25px', 'absolute', '50%', '', '50%', 'white');
	ball.style.borderRadius = '50%';
	ball.style.transform = 'translate(-50%, -50%)';
	
	const	lPlayer = document.createElement('div');
	lPlayer.id = 'lPlayer';
	styleElement(lPlayer, '10px', '100px', 'absolute', '35%', '', '10px', 'white');
	
	const	rPlayer = document.createElement('div');
	rPlayer.id = 'rPlayer';
	styleElement(rPlayer, '10px', '100px', 'absolute', '35%', '10px', '', 'white');
	
	const centerLine = document.createElement('div');
	centerLine.id = 'centerLine';
	styleElement(centerLine, '0', '100%', 'absolute', '0', '', '50%');
	centerLine.style.borderLeft = '4px dotted white';
	centerLine.style.transform = 'translateX(-50%)';
	
	field.appendChild(centerLine);
	field.appendChild(ball);
	field.appendChild(lPlayer);
	field.appendChild(rPlayer);
	container.appendChild(title);
	container.appendChild(field);
	game.appendChild(container);
	body.appendChild(game);
	
}


export function removeGameField() {
	const	body = document.getElementById('body');
	const	game = document.getElementById('game');

	if (body && game)
		body.removeChild(game);
}
