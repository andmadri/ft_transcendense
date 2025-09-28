import { UI, Game } from "../gameData.js";
import { navigateTo } from "../history.js";
import { requestJoinTournament } from "../Tournament/tournamentContent.js";

export function styleMainBtns(button: HTMLButtonElement, text: string) {
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
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
}

export function styleListBtns(button: HTMLButtonElement, img_url: string | null) {
	button.style.width = 'clamp(20px, 2vw, 25px)';
	button.style.aspectRatio = '1/1';
	button.style.borderRadius = '50%';
	if (img_url) {
		button.style.backgroundImage = img_url;
		button.style.backgroundSize = 'cover';
		button.style.backgroundPosition = 'center';
	}
	button.style.border = 'none';
	button.style.cursor = 'pointer';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
}

export function getCreditsPage() {
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
	creditDiv.style.display = 'flex';
	creditDiv.style.flexDirection = 'column';
	creditDiv.style.justifyContent = 'center';
	creditDiv.style.alignItems = 'center';
	creditDiv.style.zIndex = '105';

	const imgContainer = document.createElement('div');
	styleBlock('Credits', imgContainer); 

	const creditImg = document.createElement('img');
	creditImg.src = "./../images/Credits.png";
	creditImg.style.maxWidth = '90vw';
	creditImg.style.maxHeight = '90vh';
	creditImg.style.objectFit = 'contain';
	

	const closeBtn = document.createElement('button');
	styleMainBtns(closeBtn, 'X');
	closeBtn.style.flex = '';
	closeBtn.style.margin = '10px';
	closeBtn.style.zIndex = '110';

	imgContainer.append(creditImg, closeBtn);
	creditDiv.appendChild(imgContainer);
	body.appendChild(creditDiv);

	closeBtn.addEventListener('click', () => {
		body.removeChild(creditDiv);
		navigateTo('Menu');
	})
	if (!document.getElementById('menu'))
		getMenu();
}

export function getCreditBtn(): HTMLButtonElement {
	const creditsBtn = document.createElement('button');
	styleMainBtns(creditsBtn, "Credits");

	creditsBtn.addEventListener('click', () => { navigateTo('Credits') })
	return (creditsBtn);
}

export function getPlayBtn(): HTMLButtonElement {
	const playBtn = document.createElement('button');
	styleMainBtns(playBtn, "Play Game")
	playBtn.addEventListener('click', () => {
		navigateTo('OpponentMenu')
	});
	return (playBtn);
}

function getTournamentBtn(): HTMLButtonElement {
	const tournamentBtn = document.createElement('button');
	styleMainBtns(tournamentBtn, "Join Tournament");
	tournamentBtn.addEventListener('click', requestJoinTournament);
	return tournamentBtn;
}

export function getDashboardBtn(): HTMLButtonElement {
	const dashboardBtn = document.createElement('button');
	styleMainBtns(dashboardBtn, "Dashboard");
	dashboardBtn.addEventListener('click', () => {
		navigateTo(`Dashboard?userId=${UI.user1.ID}`);
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
	title.style.fontSize = 'clamp(18px, 1vw, 20px)';
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

export function getUserTournamentBlock(): HTMLDivElement {
	const users_block = document.createElement('div');
	users_block.style.display = 'flex';
	users_block.style.flex = '1 1 50%';
	users_block.style.flexDirection = 'column';
	users_block.style.gap = '1rem';
	users_block.style.height = '100%';

	const user1_block = document.createElement('div');
	user1_block.id = 'user1_block';

	const user2_block = document.createElement('div');
	user2_block.id = 'user2_block';

	users_block.appendChild(user1_block);
	users_block.appendChild(user2_block);
	Game.socket.emit('message', {
		action: 'userDataMenu', 
		subaction: 'getUserDataMenu',
	});
	return users_block;
}

function getFriendsBlock(): HTMLDivElement {
	const friends_block = document.createElement('div');
	friends_block.style.flex = '1 1 25%';
	friends_block.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	styleBlock("Friends", friends_block, "friends_list");
	Game.socket.emit('message', {
		action: 'friends', 
		subaction: 'getFriends'
	});
	return friends_block;
}

function getPlayersBlock(): HTMLDivElement {
	const players_block = document.createElement('div');
	players_block.style.flex = '1 1 25%';
	players_block.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	styleBlock("Players", players_block, "players_list");
	Game.socket.emit('message', {
		action: 'players', 
		subaction: 'getAllPlayers'
	});
	return players_block;
}

export function createBackgroundText(body: HTMLElement) {
	const backgroundText = document.createElement('div');
	backgroundText.id = 'backgroundText';
	backgroundText.style.position = 'fixed';
	backgroundText.style.top = '0';
	backgroundText.style.left = '0';
	backgroundText.style.width = '100%';
	backgroundText.style.height = '100%';
	backgroundText.style.overflow = 'hidden';
	backgroundText.style.pointerEvents = 'none';
	backgroundText.style.zIndex = '0';
	backgroundText.style.fontFamily = '"Horizon", monospace';
	backgroundText.style.fontSize = 'clamp(50px, 10vw, 105px)';
	backgroundText.style.fontWeight = 'bold';
	backgroundText.style.color = 'rgba(0, 0, 0, 0.07)';
	backgroundText.style.lineHeight = '1.2';
	backgroundText.style.whiteSpace = 'nowrap';
	backgroundText.style.userSelect = 'none';

	const rows = 200;
	const cols = 100;
			
	for (let row = 0; row < rows; row++) {
		const rowDiv = document.createElement('div');
		rowDiv.style.display = 'flex';
		rowDiv.style.gap = '1.5rem';
		
		for (let col = 0; col < cols; col++) {
			const pongSpan = document.createElement('span');
			pongSpan.textContent = 'PONG';
			pongSpan.style.letterSpacing = '0.5rem';
			rowDiv.appendChild(pongSpan);
		}
		
		backgroundText.appendChild(rowDiv);
	}
	body.appendChild(backgroundText);
}

export function getMenu() {
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.innerHTML = '';

	createBackgroundText(body);

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
