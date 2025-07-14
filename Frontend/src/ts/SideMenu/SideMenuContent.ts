import { Game } from '../script.js'

function getPlayer(nr: number) {
	const	player = document.createElement('div');
	const	playername = document.createElement('p');
	const	playerscore = document.createElement('p');
	const	logout = document.createElement('button');

	if (nr == 1)
		playername.textContent = Game.name;
	else
		playername.textContent = Game.name2;
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
		const msg = { action: 'logout', player: 1, id: Game.id};
		if (nr == 1)
		{
			Game.name = 'unknown';
			Game.score = 0;
			Game.player1Login = false;
			Game.id = 0;	
			if (Game.id == 0)
				return	;
		} else {
			Game.name2 = 'unknown';
			Game.score = 0;
			Game.player2Login = false;
			Game.id2 = 0;
			msg.player = 2;
			msg.id = Game.id2;
			if (Game.id2 == 0)
				return ;
		}
		Game.socket.send(JSON.stringify(msg));
		console.log(`Logging out player ${nr}`);
	});

	player.appendChild(playername);
	player.appendChild(playerscore);
	player.appendChild(logout);
	return (player);
}

export function getSideMenu() {
	const body = document.getElementById('body');
	const menu = document.createElement('div');
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

	
	const	player1 = getPlayer(1);
	const	player2 = getPlayer(2);

	menu.appendChild(player1);
	menu.appendChild(player2);
	body?.appendChild(menu);
}

export function updateNamesMenu() {
	const namePlayer1 = document.getElementById('playerName1');
	const namePlayer2 = document.getElementById('playerName2');

	if (namePlayer1)
		namePlayer1.textContent = Game.name;
	if (namePlayer2)
		namePlayer2.textContent = Game.name2;
}

export function updateScoreMenu() {
	const scorePlayer1 = document.getElementById('playerScore1');
	const scorePlayer2 = document.getElementById('playerScore2');

	if (scorePlayer1)
		scorePlayer1.textContent = Game.score.toString();
	if (scorePlayer2)
		scorePlayer2.textContent = Game.score2.toString();
}

export function resetScoreMenu() {
	const scorePlayer1 = document.getElementById('playerScore1');
	const scorePlayer2 = document.getElementById('playerScore2');

	if (scorePlayer1)
		scorePlayer1.textContent = '0';
	if (scorePlayer2)
		scorePlayer2.textContent = '0';
	Game.score = 0;
	Game.score2 = 0;
}