import { Game } from '../script.js'
import { submitLogout } from '../Auth/logout.js';
import { updatePlayerData } from '../SideMenu/updatePlayerData.js';
import { log } from '../logging.js';

function getPlayer(nr: number) {
	const	player = document.createElement('div');
	const	playername = document.createElement('p');
	const	logout = document.createElement('button');

	const	isPlayer1 = nr === 1;

	playername.textContent = isPlayer1 ? Game.name : Game.name2;
	playername.id = 'playerName' + nr;

	
	player.style.padding = '5px';
	player.style.height = '70px';
	player.style.width = '500px';
	player.style.position = 'relative';

	logout.id = 'logoutbutton' + nr;
	logout.textContent = 'Logout';
	logout.addEventListener('click', (e) => submitLogout(e, nr));
	player.append(playername, logout);
	return (player);
}

export async function getSideMenu() {
	const app = document.getElementById('app');
	if (!app) return ;
	const menu = document.createElement('div');
	if (!menu) return ;

	menu.id = 'sidemenu';
	menu.style.width = '100%';
	menu.style.position = 'fixed';
	menu.style.bottom = '10%';
	menu.style.width = '100%';
	menu.style.height = '5%';
	menu.style.display = 'grid';
	menu.style.zIndex = '1000';
	menu.style.gridTemplateColumns = '1fr 1fr';
	menu.style.gap = '1rem';
	menu.append(getPlayer(1), getPlayer(2));
	app.appendChild(menu);
	updatePlayerData();
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