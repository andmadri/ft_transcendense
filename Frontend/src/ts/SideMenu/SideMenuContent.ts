import { Game } from '../script.js'

function getPlayer(nr: number) {
	const	player = document.createElement('div');
	const	playername = document.createElement('p');
	const	playerscore = document.createElement('p');
	const	logout = document.createElement('button');

	const	isPlayer1 = nr === 1;

	playername.textContent = isPlayer1 ? Game.name : Game.name2;
	playername.id = 'playerName' + nr;

	playerscore.textContent = '0';
	playerscore.id = 'playerScore' + nr;
	
	player.style.padding = '5px';
	player.style.height = '70px';
	player.style.width = '500px';
	player.style.backgroundColor = 'yellow';
	player.style.position = 'relative';

	logout.id = 'logoutbutton' + nr;
	logout.textContent = 'Logout';
	logout.addEventListener('click', () => {
		const msg = {
			action: 'login',
			subaction: 'logout',
			player: nr,
			id: isPlayer1 ? Game.id : Game.id2
		};

		if (isPlayer1) {
			Game.name = 'unknown';
			Game.score = 0;
			Game.player1Login = false;
			Game.id = 0;
		} else {
			Game.name2 = 'unknown';
			Game.score = 0;
			Game.player2Login = false;
			Game.id2 = 0;
		}
		playername.textContent = 'unknown';
		playerscore.textContent = '0';

		Game.socket.send(JSON.stringify(msg));
		console.log(`Logging out player ${nr}`);
	});

	player.append(playername, playerscore, logout);
	return (player);
}

export function getSideMenu() {
	const body = document.getElementById('body');
	if (!body) return ;
	const menu = document.createElement('div');
	if (!menu) return ;

	menu.id = 'sidemenu';
	menu.style.width = '100%';
	menu.style.position = 'fixed';
	menu.style.bottom = '0';
	menu.style.left = '0';
	menu.style.width = '100%';
	menu.style.height = '10%';
	menu.style.display = 'grid';
	menu.style.zIndex = '1000';
	menu.style.gridTemplateColumns = '1fr 1fr';
	menu.style.gap = '1rem';

	menu.append(getPlayer(1), getPlayer(2));
	body.appendChild(menu);
}

function updateTextbyId(id: string, value: string) {
	const	element = document.getElementById(id);
	if (element)
		element.textContent = value;
}

export function updateNamesMenu() {
	updateTextbyId('playerName1', Game.name);
	updateTextbyId('playerName2', Game.name2);
}

export function updateScoreMenu() {
	updateTextbyId('playerScore1', Game.score.toString());
	updateTextbyId('playerScore2', Game.score2.toString());
}

export function resetScoreMenu() {
	updateTextbyId('playerScore1', '0');
	updateTextbyId('playerScore2', '0');

	Game.score = 0;
	Game.score2 = 0;
}