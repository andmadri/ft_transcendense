import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { getFriendsList } from './friends.js';
// import { getOnlineList } from './online.js';
// import { getStatsList } from './stats.js';
// import { getHighscores } from './highscore.js'
// import { getSettingsPage  } from '../SettingMenu/settings.js';
import { submitLogout } from '../Auth/logout.js';
import { changeAvatar } from './avatar.js';
import { log } from '../logging.js';
import { navigateTo } from "../history.js"; //USE THIS!!!

function styleBtn(button: HTMLButtonElement, text: string)
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
}

function getCreditBtn(): HTMLButtonElement {
	const creditsBtn = document.createElement('button');
	creditsBtn.style.flex = '1 1 25%';
	styleBtn(creditsBtn, "Credits");

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

function getPlayBtn(): HTMLButtonElement {
	const playBtn = document.createElement('button');
	styleBtn(playBtn, "Play Game")
	playBtn.style.flex = '1 1 25%';
	playBtn.addEventListener('click', () => {
		Game.state = S.State.OptionMenu;
	});
	return (playBtn);
}

function getDashboardBtn(): HTMLButtonElement {
	const dashboardBtn = document.createElement('button');
	dashboardBtn.style.flex = '1 1 50%'
	styleBtn(dashboardBtn, "Dashboard");
	dashboardBtn.addEventListener('click', () => {
		navigateTo('Dashboard');
	});
	return (dashboardBtn);
}

function styleBlock(title_text: string, block: HTMLElement): HTMLDivElement {

	//we have a block
	// inside the block goes title and elements
	block.style.background = '#363430'
	block.style.display = 'flex';
	block.style.flexDirection = 'column';
	block.style.alignItems = 'center';
	// block.style.justifyContent = 'center';
	block.style.padding = '1rem';
	block.style.borderRadius = '10px';

	const title = document.createElement('div');
	title.textContent = title_text;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.color = 'transparent';
	title.style.fontSize = 'clamp(18px, 3vw, 36px)';
	title.style.whiteSpace = 'nowrap';
	title.style.display = 'inline-block';
	title.style.textAlign = 'center';
	title.style.marginBottom = '0.5rem';

	const list = document.createElement('div');
	list.style.display = 'flex';
	list.style.flexDirection = 'column';
	list.style.gap = '0.5rem';
	list.style.width = '100%';

	block.appendChild(title);
	block.appendChild(list);
	return list;
}

function addPlayersRow(list: HTMLDivElement, playerName: string)
{
	//if the name is bigger than certain characters crop it
	const row = document.createElement('div');
	row.textContent = "• " + (playerName ?? "");
	row.style.padding = '0.5rem 1 rem';
	// row.style.border = '1px solid #888';
	row.style.borderRadius = '5px';
	row.style.backgroundColor = '#2a2927';
	row.style.color = 'white';
	row.style.fontFamily = '"RobotoCondensed", sans-serif';
	row.style.fontSize = 'clamp(10px, 1.5vw, 17px)';
	row.style.cursor = 'pointer';
	row.style.padding = '0.3rem 0.5rem';
	row.style.flex = '1';
	list.appendChild(row);
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

function getUserBlock(): HTMLDivElement {
	const users_block = document.createElement('div');
	users_block.style.flex = '1 1 50%';
	users_block.style.direction = 'column';

	const user_tabs = document.createElement('div');
	user_tabs.style.display = 'flex';
	user_tabs.style.flexDirection = 'row';
	user_tabs.style.width = '100%';

	const user1_tab = document.createElement('div');
	user1_tab.style.flex = '1 1 50%';
	styleUserTab(user1_tab, "1");

	const user2_tab = document.createElement('div');
	user2_tab.style.flex = '1 1 50%';
	styleUserTab(user1_tab, "1");

	function activateTab(active: HTMLDivElement, inactive: HTMLDivElement) {
		active.style.background = "#363430";
		inactive.style.background = "rgba(54, 52, 48, 0.5)";
	}

	activateTab(user1_tab, user2_tab);

	user1_tab.addEventListener("click", () => activateTab(user1_tab, user2_tab));
	user2_tab.addEventListener("click", () => activateTab(user2_tab, user1_tab));

	const users_info = document.createElement('div');
	styleBlock("Player", users_info);

	user_tabs.appendChild(user1_tab)
	user_tabs.appendChild(user2_tab)

	users_block.appendChild(user_tabs);
	users_block.appendChild(users_info);
	return users_block;
}

function getFriendsBlock(): HTMLDivElement {
	const friends_block = document.createElement('div');
	friends_block.style.flex = '1 1 25%';
	const list = styleBlock("Friends", friends_block);
	const friends = ['Alice', 'Bob', 'Charlie'];
	friends.forEach(friend  => addPlayersRow(list, friend));
	return friends_block;
}

function getPlayersBlock(): HTMLDivElement {
	const players_block = document.createElement('div');
	players_block.style.flex = '1 1 25%';
	const list = styleBlock("Players", players_block);
	const players = ['Alice', 'Bob', 'Charlie', 'Maria', 'Carlos', 'Jack', 'Kevin', 'Martijn', 'Norika', 'Pablo'];
	players.forEach(player => addPlayersRow(list, player));
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
	menuContainer.id = 'menuContainer';
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
	menuBlocks.appendChild(getUserBlock());
	menuBlocks.appendChild(getFriendsBlock());
	menuBlocks.appendChild(getPlayersBlock());

	const menuButtons = document.createElement('div');
	menuButtons.id = 'menuButtons';
	menuButtons.style.display = 'flex';
	menuButtons.style.flexDirection = 'row';
	menuButtons.style.gap = '1rem';
	menuButtons.style.justifyContent = 'center';
	menuButtons.style.width = 'clamp(1000px, 90vw, 1500px)';
	menuButtons.appendChild(getDashboardBtn());
	menuButtons.appendChild(getPlayBtn());
	menuButtons.appendChild(getCreditBtn());

	menuContainer.appendChild(menuBlocks);
	menuContainer.appendChild(menuButtons);
	body.appendChild(menuContainer);
}
