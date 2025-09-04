import { navigateTo } from "../history";
import { styleListBtns } from "./menuContent";
import { get2faBtn, getLoginBtn, getAvatarBtn } from "./userDataMenuButtons";

function styleBtnUserMenu(button: HTMLButtonElement): HTMLButtonElement {
	button.style.display = 'flex';
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	button.style.cursor = 'pointer';
	button.style.textAlign = 'center';
	button.style.borderRadius = '10px';
	button.style.fontSize = 'clamp(10px, 1.5vw, 15px)';
	button.style.padding = '0.7rem';
	button.style.color = 'black';
	button.style.border = 'none';
	button.style.alignItems = 'center';
	button.style.justifyContent = 'center';
	button.style.height = '50%';
	button.style.flex = '1 1 0%';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	return button;
}

function styleTabButton(button: HTMLButtonElement, isActive: boolean) {
	button.style.textAlign = 'center';
	button.style.fontFamily = '"Horizon", sans-serif';
	button.style.fontSize = 'clamp(12px, 1.2vw, 16px)';
	button.style.cursor = 'pointer';
	button.style.padding = '0.5rem 1rem';
	button.style.borderRadius = '10px 10px 0 0';
	button.style.border = 'none';
	button.style.flex = 'auto';
	// button.style.marginRight = '2px';
	if (isActive) {
		button.style.background = '#363430';
		button.style.color = 'white';
		button.style.borderBottom = '2px solid #363430';
		button.style.zIndex = '2';
	} else {
		button.style.background = '#36343080';
		button.style.color = '#ccc';
		button.style.zIndex = '1';
	}
}

function renderUserCardMenu(user_info: any, stats: any, playerNr: number)
{
	const card = document.getElementById('user_block');
	if (!card)
		return ;

	card.style.borderRadius = '0px 0px 10px 10px';
	card.style.zIndex = '2';
	const tabContainer = document.createElement('div');
	tabContainer.style.display = 'flex';
	tabContainer.style.marginBottom = '-16px'; // Overlap with card
	// tabContainer.style.zIndex = '2';
	tabContainer.style.position = 'relative';

	const player1Tab = document.createElement('button');
	player1Tab.textContent = '1';
	styleTabButton(player1Tab, playerNr === 1);
	// player1Tab.addEventListener('click', () => switchToPlayer(1));

	const player2Tab = document.createElement('button');
	player2Tab.textContent = '2';
	styleTabButton(player2Tab, playerNr === 2);
	// player2Tab.addEventListener('click', () => switchToPlayer(2));

	tabContainer.appendChild(player1Tab);
	tabContainer.appendChild(player2Tab);

	const container = document.createElement('div');
	container.style.display = 'flex';
	container.style.width = '100%';
	container.style.height = '50%';

	const buttonsContainer = document.createElement('div');
	buttonsContainer.style.display = 'flex';
	buttonsContainer.style.flexDirection = 'row';
	buttonsContainer.style.width = '100%';
	buttonsContainer.style.height = '35%';
	buttonsContainer.style.justifyContent = 'space-between';
	buttonsContainer.style.gap = '1rem';
	buttonsContainer.style.alignItems = 'center';
	// buttonsContainer.style.margin = '1rem';

	const userPic = document.createElement('img');
	userPic.src = `/api/avatar/${user_info.id}`;
	userPic.alt = `${user_info.name}'s avatar`;
	userPic.style.height = 'clamp(60px, 90%, 120px)';
	userPic.style.aspectRatio = '1/1';
	userPic.style.objectFit = 'cover';
	userPic.style.borderRadius = '50%';
	// userPic.style.padding = '1rem';
	userPic.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';

	const userInfoContainer = document.createElement('div');
	userInfoContainer.style.display = 'flex';
	userInfoContainer.style.flexDirection = 'column';
	userInfoContainer.style.gap = '0.7rem';
	userInfoContainer.style.height = '30%';
	userInfoContainer.style.padding = '1rem';

	const userName = document.createElement('div');
	userName.textContent = `${user_info.name}`;
	userName.style.fontFamily = '"Horizon", monospace';
	userName.style.webkitTextStroke = '0.1rem #ffffff';
	userName.style.color = 'transparent';
	userName.style.fontSize = 'clamp(18px, 2.5vw, 26px)';
	userName.style.whiteSpace = 'nowrap';

	const userStats = document.createElement('div');
	userStats.textContent = `Games: ${stats.total_matches} W: ${stats.wins} L: ${stats.losses}`;
	userStats.style.fontFamily = '"RobotoCondensed", monospace';
	userStats.style.color = 'white';
	userStats.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
	userStats.style.whiteSpace = 'nowrap';


	const topRightButtons = document.createElement('div');
	topRightButtons.style.display = 'flex';
	topRightButtons.style.width = '100%';
	topRightButtons.style.flexDirection = 'row';
	topRightButtons.style.gap = '0.5rem';
	topRightButtons.style.justifyContent = 'flex-end'; // Align to the right
	topRightButtons.style.alignItems = 'flex-start';
	topRightButtons.style.padding = '1rem';


	const dashboardBtn = document.createElement('button');
	styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
	// dashboardBtn.style.width = 'clamp(26px, 1.5vw, 40px)';
	dashboardBtn.addEventListener("click", () => {
		navigateTo('Dashboard');
	});

	const notificationsBtn = document.createElement('button');
	styleListBtns(notificationsBtn, 'url("../../images/notifications.png")');
	// dashboardBtn.style.width = 'clamp(26px, 1.5vw, 40px)';
	dashboardBtn.addEventListener("click", () => {
		navigateTo('Dashboard');
	});

	topRightButtons.appendChild(dashboardBtn);
	topRightButtons.appendChild(notificationsBtn);
	userInfoContainer.appendChild(userName);
	userInfoContainer.appendChild(userStats);
	buttonsContainer.appendChild(styleBtnUserMenu(get2faBtn(playerNr)));
	buttonsContainer.appendChild(styleBtnUserMenu(getAvatarBtn(playerNr)));
	buttonsContainer.appendChild(styleBtnUserMenu(getLoginBtn(playerNr)));
	
  container.appendChild(userPic);
  container.appendChild(userInfoContainer);
	container.appendChild(topRightButtons);
	card.parentElement?.insertBefore(tabContainer, card);
  card.appendChild(container);
	card.appendChild(buttonsContainer);
}

export function actionUserDataMenu(data: any) {
	console.log('Action to get UserDataMenu')
	if (!data.subaction) {
		console.error('No subaction in userDataMenu data');
		return ;
	} else if (data.subaction === 'receivedUserDataMenu') {
		renderUserCardMenu(data.user_info, data.stats, data.playerNr);
	} else {
		console.log(`Unknown subaction in playerInfo: ${data.subaction}`);
	}
}