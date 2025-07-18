import { removeAuthField } from '../Auth/authContent.js';
import { removeMenu } from '../Menu/menuContent.js'
import { log } from '../logging.js'
import { Game } from '../script.js'

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

export function getGameField() {
	if (document.getElementById('auth1'))
		removeAuthField(1);
	if (document.getElementById('auth2'))
		removeAuthField(2);
	if (document.getElementById('menu'))
		removeMenu();

	const	body = document.getElementById('body');

	const	quiting = document.createElement('div');
	quiting.style.display = 'flex';
	quiting.style.justifyContent = 'flex-end';
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
	})
	quiting.appendChild(quit);
	body?.appendChild(quiting);

	const	game = document.createElement('div');
	game.id = 'game';
	styleElement(game, '1200px', '700px', 'relative', '50px', '0px', '0px', 'green');
	game.style.display = 'flex';
	game.style.margin = '0 auto';

	const	field = document.createElement('div');
	field.id = 'field';
	game.style.display = 'flex';
	styleElement(field, '1200px', '700px', 'relative', '0px', '0px', '0px', 'black');

	const	ball = document.createElement('div');
	ball.id = 'ball';
	styleElement(ball, '25px', '25px', 'absolute', '0px', '', '0px', 'white');
	ball.style.borderRadius = '50%';
	ball.style.transform = 'translate(-50%, -50%)';

	const	lPlayer = document.createElement('div');
	lPlayer.id = 'lPlayer';
	styleElement(lPlayer, '10px', '100px', 'absolute', '300px', '', '0px', 'yellow');

	const	rPlayer = document.createElement('div');
	rPlayer.id = 'rPlayer';
	styleElement(rPlayer, '10px', '100px', 'absolute', '300px', '0px', '', 'purple');

	field.append(ball, lPlayer, rPlayer);
	game.appendChild(field);
	body?.appendChild(game);
}

export function removeGameField() {
	const	body = document.getElementById('body');
	const	game = document.getElementById('game');
	const	quit = document.getElementById('quitBtn');

	if (!body)
		return ;
	if (game)
		body.removeChild(game);
	if (quit)
		body.removeChild(quit);
}
