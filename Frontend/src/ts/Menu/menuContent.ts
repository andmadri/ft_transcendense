import { changeOpponentType, changeMatchFormat, startGame } from '../Game/initGame.js';
import { Game } from '../script.js'
import { removeAuthField } from '../Auth/authContent.js'
import { removeGameField } from '../Game/gameContent.js'
import { log } from '../logging.js'
import { getSideMenu } from '../SideMenu/SideMenuContent.js';

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
	title.textContent = 'Friends';

	const list = document.createElement('div');
	list.id = 'friendsList';
	
	friends.append(title, list);
	return friends;
}

function createOnlineList(): HTMLDivElement {
	const online = document.createElement('div');
	online.id = 'online';
	styleElement(online, '1', '1 / span 2', 'lightblue', '1rem');
	online.style.borderRight = '1px solid #ccc';

	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Online123';

	const list = document.createElement('div');
	list.id = 'listOnlinePlayers';


	const html_list = document.createElement('ul');
	html_list.id = 'htmllistOnlinePlayers';
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	online.append(title, list);
	return (online);
}

function getOnlineList(): HTMLDivElement {
	let online = document.getElementById('online') as HTMLDivElement;
	
	if (!online)
		online = createOnlineList();
	else {
		const list = document.getElementById('htmllistOnlinePlayers');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	// backend request to the DB for all online players
	// const online_players = ['Player1', 'Player2', 'Player3']; // This should be replaced with actual data from the backend
	const msg = {action: 'online', subaction: 'getOnlinePlayers'};
	Game.socket.send(JSON.stringify(msg));

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

	highscores.append(title, list);
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

	opponentTypesDiv.append(btn1v1, btn1vCom, btnOnline);

	const matchTypesDiv = document.createElement('div');
	matchTypesDiv.className = 'opponentTypes';

	const btnSingleGame = document.createElement('button');
	btnSingleGame.type = 'button';
	btnSingleGame.textContent = 'single game';
	btnSingleGame.addEventListener('click', () => changeMatchFormat('single game'));

	const btnTournament = document.createElement('button');
	btnTournament.type = 'button';
	btnTournament.textContent = 'tournament';
	btnTournament.addEventListener('click', () => changeMatchFormat('tournament'));

	matchTypesDiv.append(btnSingleGame, btnTournament);

	const startBtn = document.createElement('button');
	startBtn.id = 'startGame';
	startBtn.type = 'button';
	startBtn.textContent = 'PLAY';
	startBtn.addEventListener('click', () => startGame());

	options.append(opponentTypesDiv, matchTypesDiv, startBtn);

	return options;
}

export function getMenu() {
	const body = document.getElementById('body');
	if (!body)
		return ;

	body.innerHTML = "";
	const menu = document.createElement('div');
	menu.id = 'menu';
	menu.style.display = 'flex';
	menu.style.flexDirection = 'column';
	menu.style.alignItems = 'center';
	menu.style.justifyContent = 'center';

	menu.append(getGameSettings(), getFriends(), getHighscores(), getOnlineList());
	body?.appendChild(menu);
	getSideMenu();

}

export function removeMenu() {
	const	body = document.getElementById('body');
	const	menu = document.getElementById('menu');

	if (body && menu)
		body.removeChild(menu);
}
