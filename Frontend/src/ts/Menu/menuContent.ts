import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
// import { getFriendsList } from './friends.js';
// import { getOnlineList } from './online.js';
// import { getStatsList } from './stats.js';
// import { getHighscores } from './highscore.js'
// import { getSettingsPage  } from '../SettingMenu/settings.js';
import { submitLogout } from '../Auth/logout.js';
import { changeAvatar } from './avatar.js';
import { log } from '../logging.js';
import { navigateTo } from "../history.js"; //USE THIS!!!
import { getDashboard } from "../Dashboard/dashboardContents.js";

function styleMainBtns(button: HTMLButtonElement, text: string)
{
	button.textContent = text;
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.backgroundColor = '#363430';
	button.style.cursor = 'pointer';
	button.style.textAlign = 'center';
	button.style.borderRadius = '10px';
	button.style.fontSize = 'clamp(10px, 1.5vw, 17px)';
	button.style.padding = '0.7rem';
	button.style.color = 'white';
	button.style.border = 'none';
	button.style.flex = '1';
}

export function styleListBtns(button: HTMLButtonElement, img_url: string) {
	button.style.width = '20px';
	button.style.aspectRatio = '1/1';
	button.style.borderRadius = '50%';
	button.style.backgroundImage = img_url;
	button.style.backgroundSize = 'cover';
	button.style.backgroundPosition = 'center';
	button.style.border = 'none';
	button.style.cursor = 'pointer';
}

export function getCreditBtn(): HTMLButtonElement {
	const creditsBtn = document.createElement('button');
	// creditsBtn.style.flex = '1 1 25%';
	styleMainBtns(creditsBtn, "Credits");

	creditsBtn.addEventListener('click', () => {
		const body = document.getElementById('body');
		if (!body)
			return ;

		const creditDiv = document.createElement('div');
		creditDiv.id = 'creditDiv';
		creditDiv.style.position = 'fixed';
		creditDiv.style.width = '100vw';
		creditDiv.style.height = '100vh';
		creditDiv.style.top = '0';
		creditDiv.style.left = '0';
		creditDiv.style.backgroundColor = 'white';
		creditDiv.style.display = 'flex';
		creditDiv.style.flexDirection = 'column';
		creditDiv.style.justifyContent = 'center';
		creditDiv.style.alignItems = 'center';

		const creditImg = document.createElement('img');
		creditImg.src = "./../images/Credits.png";
		creditImg.style.maxWidth = '90vw';
		creditImg.style.maxHeight = '90vh';
		creditImg.style.objectFit = 'contain';

		const closeBtn = document.createElement('button');
		closeBtn.textContent = "CLOSE";
		closeBtn.style.zIndex = '100000';
		closeBtn.style.margin = '10px';

		creditDiv.appendChild(creditImg);
		creditDiv.appendChild(closeBtn);
		body.appendChild(creditDiv);

		closeBtn.addEventListener('click', () => {
			body.removeChild(creditDiv);
		})
	})
	return (creditsBtn);
}

export function getPlayBtn(): HTMLButtonElement {
	const playBtn = document.createElement('button');
	styleMainBtns(playBtn, "Play Game")
	// playBtn.style.flex = '1 1 25%';
	playBtn.addEventListener('click', () => {
		navigateTo('Settings')
	});
	return (playBtn);
}

export function getTournamentBtn(): HTMLButtonElement {
	const tournamentBtn = document.createElement('button');
	styleMainBtns(tournamentBtn, "Tournament");
	tournamentBtn.addEventListener('click', () => {
		console.log('I am tired');
	});
	return (tournamentBtn);
}

export function getDashboardBtn(): HTMLButtonElement {
	const dashboardBtn = document.createElement('button');
	styleMainBtns(dashboardBtn, "Dashboard");
	dashboardBtn.addEventListener('click', () => {
		navigateTo('Dashboard');
	});
	return (dashboardBtn);
}

export function styleBlock(title_text: string, block: HTMLElement, list_id?: string) {

	block.style.background = '#363430'
	block.style.display = 'flex';
	block.style.flexDirection = 'column';
	block.style.alignItems = 'center';
	block.style.padding = '1rem';
	block.style.borderRadius = '10px';
	block.style.position = 'relative';

	const title = document.createElement('div');
	title.textContent = title_text;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.color = 'transparent';
	title.style.fontSize = 'clamp(15px, 2vw, 26px)';
	title.style.whiteSpace = 'nowrap';
	title.style.display = 'inline-block';
	title.style.textAlign = 'center';
	title.style.marginBottom = '0.5rem';

	block.appendChild(title);
	if (list_id) {
		const list = document.createElement('ul');
		list.id = list_id;
		list.style.display = 'flex';
		list.style.flexDirection = 'column';
		list.style.gap = '0.5rem';
		list.style.width = '100%';
		list.style.padding = '0';
		list.style.margin = '0';
		list.style.overflowY = 'auto';
		block.appendChild(list);
	}
}

export function styleRow(playerName: string)
{
	const row = document.createElement('li');
	row.textContent = playerName ?? "";
	row.style.padding = '0.3rem 0.5rem';
	row.style.borderRadius = '5px';
	row.style.backgroundColor = '#2a2927';
	row.style.color = 'white';
	row.style.justifyItems = 'space-between';
	row.style.fontFamily = '"RobotoCondensed", sans-serif';
	row.style.fontSize = 'clamp(10px, 1.5vw, 17px)';
	row.style.cursor = 'pointer';
	row.style.display = 'flex';
	row.style.listStyleType = 'none';
	row.style.flex = '1';
	row.style.alignItems = 'center';
	row.style.justifyContent = 'space-between';
	return row;
}

function styleUserTab(tab: HTMLDivElement, text: string) {
	tab.style.background = '#363430';
	tab.style.fontSize = 'clamp(10px, 1.5vw, 17px)';
	tab.style.alignItems = 'center';
	tab.style.justifyContent = 'center';
	tab.style.fontFamily = '"Horizon", sans-serif';
	tab.style.webkitTextStroke = '0.1rem #ffffff';
	tab.style.color = 'transparent';
	tab.style.fontSize = 'clamp(18px, 3vw, 36px)';
	tab.style.whiteSpace = 'nowrap';
	tab.style.display = 'inline-block';
	tab.style.textAlign = 'center';
	tab.style.marginBottom = '0.5rem';
}

export function getUserTournamentBlock(): HTMLDivElement {
	const users_tournament_block = document.createElement('div');
	users_tournament_block.style.display = 'flex';
	users_tournament_block.style.flex = '1 1 50%';
	users_tournament_block.style.flexDirection = 'column';
	users_tournament_block.style.gap = '1rem';
	users_tournament_block.style.height = '100%';

	const user_block = document.createElement('div');
	user_block.id = 'user_block';
	user_block.style.display = 'flex';
	user_block.style.height = '50%';
	user_block.style.background = '#363430'
	user_block.style.display = 'flex';
	user_block.style.flexDirection = 'column';
	user_block.style.alignItems = 'center';
	user_block.style.padding = '1rem';
	user_block.style.borderRadius = '10px';
	user_block.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';

	//have a button that changes whether is player1 or player2
	//playerNr = playerNr === 1 ? : 2 : 1;
	let playerNr = 1;

	const tournament_block = document.createElement('div');
	tournament_block.style.display = 'flex';
	tournament_block.style.height = '50%';
	styleBlock("Tournaments", tournament_block);

	users_tournament_block.appendChild(user_block);
	users_tournament_block.appendChild(tournament_block);
	console.log("Sending data to the backend for the USERDATAMENU!!");
	Game.socket.send({
		action: 'userDataMenu', 
		subaction: 'getUserDataMenu',
		playerNr: playerNr
	});
	return users_tournament_block;
}

function getFriendsBlock(): HTMLDivElement {
	const friends_block = document.createElement('div');
	friends_block.style.flex = '1 1 25%';
	styleBlock("Friends", friends_block, "friends_list");
	Game.socket.send({
		action: 'friends', 
		subaction: 'getFriends'
	});
	return friends_block;
}

function getPlayersBlock(): HTMLDivElement {
	const players_block = document.createElement('div');
	players_block.style.flex = '1 1 25%';
	styleBlock("Players", players_block, "players_list");
	Game.socket.send({
		action: 'online', 
		subaction: 'getAllPlayers'
	});
	return players_block;
}

export function getMenu() {
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	body.innerHTML = '';

	const menuContainer = document.createElement('div');
	menuContainer.id = 'menu';
	menuContainer.style.position = 'relative';
	menuContainer.style.alignItems = 'center';
	menuContainer.style.justifyContent = 'center';
	menuContainer.style.display = 'flex';
	menuContainer.style.flexDirection = 'column';
	menuContainer.style.gap = '1rem';
	menuContainer.style.width = '100%';
	menuContainer.style.height = '100%';

	const menuBlocks = document.createElement('div');
	menuBlocks.style.display = 'flex';
	menuBlocks.style.flexDirection = 'row';
	menuBlocks.style.gap = '1rem';
	menuBlocks.style.height = 'clamp(400px, 50vh, 800px)';
	menuBlocks.style.width = 'clamp(1000px, 90vw, 1500px)';
	menuBlocks.appendChild(getUserTournamentBlock());
	menuBlocks.appendChild(getFriendsBlock());
	menuBlocks.appendChild(getPlayersBlock());

	const menuButtons = document.createElement('div');
	menuButtons.id = 'menuButtons';
	menuButtons.style.display = 'flex';
	menuButtons.style.flexDirection = 'row';
	menuButtons.style.gap = '1rem';
	menuButtons.style.justifyContent = 'center';
	menuButtons.style.width = 'clamp(1000px, 90vw, 1500px)';
	menuButtons.appendChild(getTournamentBtn());
	menuButtons.appendChild(getPlayBtn());
	menuButtons.appendChild(getCreditBtn());

	menuContainer.appendChild(menuBlocks);
	menuContainer.appendChild(menuButtons);
	body.appendChild(menuContainer);
}
