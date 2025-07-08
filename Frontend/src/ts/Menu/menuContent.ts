import { changeOpponentType, changeMatchFormat, startGame } from '../Game/initGame.js';
import { log } from '../logging.js'

function styleElement(
	element: HTMLElement,
	gridColumn?: string,
	gridRow?: string,
	backgroundColor?: string,
	padding?: string
) {
	if (gridColumn)
		element.style.gridColumn = gridColumn;
	if (gridRow)
		element.style.gridRow = gridRow;
	if (backgroundColor)
		element.style.backgroundColor = backgroundColor;
	if (padding)
		element.style.padding = padding;
}

function getFriends(): HTMLDivElement {
	const friends = document.createElement('div');
	friends.id = 'friends';
	styleElement(friends, '2', '2', 'lightgrey', '1rem');

	const title = document.createElement('h2');
	title.id = 'friendsTitle';
	title.textContent = 'Friends'; // Eventueel toevoegen

	const list = document.createElement('div');
	list.id = 'friendsList';
	
	friends.appendChild(title);
	friends.appendChild(list);

	return friends;
}

function getOnlineList(): HTMLDivElement {
	const online = document.createElement('div');
	online.id = 'online';
	styleElement(online, '1', '1 / span 2', 'lightblue', '1rem');
	online.style.borderRight = '1px solid #ccc';

	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Online';

	const list = document.createElement('div');
	list.id = 'listOnlinePlayers';

	online.appendChild(title);
	online.appendChild(list);

	return online;
}

function getHighscores(): HTMLDivElement {
	const highscores = document.createElement('div');
	highscores.id = 'highscores';
	styleElement(highscores, '3', '1 / span 2', 'lightcyan', '1rem');
	highscores.style.borderLeft = '1px solid #ccc';

	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Highscores';

	const list = document.createElement('div');
	list.id = 'listHighscores';

	highscores.appendChild(title);
	highscores.appendChild(list);

	return highscores;
}

export function getGameSettings(): HTMLDivElement {
	const options = document.createElement('div');
	styleElement(options, '2', '1', 'lightgreen', '1rem');
	options.style.borderBottom = '1px solid #000';

	const opponentTypesDiv = document.createElement('div');
	opponentTypesDiv.id = 'opponentTypes';
	opponentTypesDiv.className = 'opponentTypes';

	const btn1v1 = document.createElement('button');
	btn1v1.type = 'button';
	btn1v1.textContent = '1 VS 1';
	btn1v1.addEventListener('click', () => changeOpponentType('1 vs 1'));

	const btn1vCom = document.createElement('button');
	btn1vCom.type = 'button';
	btn1vCom.textContent = '1 VS COM';
	btn1vCom.addEventListener('click', () => changeOpponentType('1 vs COM'));

	const btnOnline = document.createElement('button');
	btnOnline.type = 'button';
	btnOnline.textContent = 'Online';
	btnOnline.addEventListener('click', () => changeOpponentType('Online'));

	opponentTypesDiv.appendChild(btn1v1);
	opponentTypesDiv.appendChild(btn1vCom);
	opponentTypesDiv.appendChild(btnOnline);

	const matchTypesDiv = document.createElement('div');
	matchTypesDiv.className = 'opponentTypes';

	const btnSingleGame = document.createElement('button');
	btnSingleGame.type = 'button';
	btnSingleGame.textContent = '1 VS 1';
	btnSingleGame.addEventListener('click', () => changeMatchFormat('single game'));

	const btnTournament = document.createElement('button');
	btnTournament.type = 'button';
	btnTournament.textContent = '1 VS COM';
	btnTournament.addEventListener('click', () => changeMatchFormat('tournament'));

	matchTypesDiv.appendChild(btnSingleGame);
	matchTypesDiv.appendChild(btnTournament);

	const startBtn = document.createElement('button');
	startBtn.id = 'startGame';
	startBtn.type = 'button';
	startBtn.textContent = 'PLAY';
	startBtn.addEventListener('click', () => startGame());

	options.appendChild(opponentTypesDiv);
	options.appendChild(matchTypesDiv);
	options.appendChild(startBtn);

	return options;
}

export function getMenu() {
	const body = document.getElementById('body');
	const menu = document.createElement('div');
	menu.id = 'menu';
	menu.style.display = 'flex';
	menu.style.flexDirection = 'column';
	menu.style.alignItems = 'center';
	menu.style.justifyContent = 'center';

	menu.appendChild(getGameSettings());
	menu.appendChild(getFriends());
	menu.appendChild(getHighscores());
	menu.appendChild(getOnlineList());

	body?.appendChild(menu);
}

export function removeMenu() {
	const	body = document.getElementById('body');
	const	menu = document.getElementById('menu');

	if (body && menu)
		body.removeChild(menu);
}