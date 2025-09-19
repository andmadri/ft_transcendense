import { navigateTo } from "../history.js";
import { UI } from "../gameData.js"
import { styleListBtns } from "./menuContent.js";
import { get2faBtn, getLoginBtn, getAvatarBtn, getChangeNameBtn } from "./userDataMenuButtons.js";

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

function styleTabButton(button: HTMLButtonElement) {
	button.style.textAlign = 'center';
	button.style.fontFamily = '"Horizon", sans-serif';
	button.style.fontSize = 'clamp(12px, 1.2vw, 16px)';
	// button.style.cursor = 'pointer';
	button.style.padding = '0.5rem 1rem'; 
	button.style.borderRadius = '10px 10px 0 0';
	button.style.border = 'none';
	button.style.flex = 'auto';
	button.style.background = '#363430';
	button.style.color = 'white';
	button.style.borderBottom = '2px solid #363430';
}

function setupBlockStyling(user1_block: HTMLElement, user2_block: HTMLElement) {
	user1_block.style.borderRadius = '0px 10px 10px 10px';
	user1_block.style.display = 'flex';
	user1_block.style.height = '30%';
	user1_block.style.background = '#363430'
	user1_block.style.display = 'flex';
	user1_block.style.flexDirection = 'column';
	user1_block.style.alignItems = 'center';
	user1_block.style.padding = '1rem';
	user1_block.style.gap = '1rem';
	// user1_block.style.borderRadius = '10px';
	user1_block.style.flex = '1 1 50%';
	user1_block.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';

	user2_block.style.display = 'flex';
	user2_block.style.height = '30%';
	user2_block.style.background = '#363430'
	user2_block.style.display = 'flex';
	user2_block.style.flexDirection = 'column';
	user2_block.style.alignItems = 'center';
	user2_block.style.padding = '1rem';
	user2_block.style.gap = '1rem';
	// user2_block.style.borderRadius = '10px';
	user2_block.style.flex = '1 1 50%';
	user2_block.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	user2_block.style.borderRadius = '0px 10px 10px 10px';
}

function clearUserBlocks(user1_block: HTMLElement, user2_block: HTMLElement) {
	const existingTab1 = user1_block.parentElement?.previousElementSibling;
	const existingTab2 = user2_block.parentElement?.previousElementSibling;
	if (existingTab1)
		existingTab1.remove();
	if (existingTab2)
		existingTab2.remove();
	user1_block.innerHTML = '';
	user2_block.innerHTML = '';
}

function createTabs(): { tabContainer1: HTMLDivElement; tabContainer2: HTMLDivElement } {
	const tabContainer1 = document.createElement('div');
	const tabContainer2 = document.createElement('div');
	[tabContainer1, tabContainer2].forEach(container => {
		container.style.display = 'flex';
		container.style.marginBottom = '-16px';
		container.style.position = 'relative';
		container.style.width = '50%';
	});
	const player1Tab = document.createElement('button');
	player1Tab.textContent = '1';
	styleTabButton(player1Tab);

	const player2Tab = document.createElement('button');
	player2Tab.textContent = '2';
	styleTabButton(player2Tab);

	tabContainer1.appendChild(player1Tab);
	tabContainer2.appendChild(player2Tab);
	return { tabContainer1, tabContainer2};
}

function createUserPicture(user_info: any): HTMLImageElement {
	const userPic = document.createElement('img');
	userPic.id = `avatar1`;
	userPic.src = `/api/avatar/${user_info?.id}?ts=${Date.now()}`
	userPic.alt = `${user_info?.name}'s avatar`;
	userPic.style.height = 'clamp(60px, 90%, 120px)';
	userPic.style.aspectRatio = '1/1';
	userPic.style.objectFit = 'cover';
	userPic.style.borderRadius = '50%';
	userPic.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	return userPic;
}

// function createUserInfoSection(user_info: any, stats: any): HTMLDivElement {
// 	const userInfoContainer = document.createElement('div');
// 	userInfoContainer.style.display = 'flex';
// 	userInfoContainer.style.flexDirection = 'column';
// 	userInfoContainer.style.gap = '0.7rem';
// 	userInfoContainer.style.height = '30%';
// 	userInfoContainer.style.padding = '1rem';

// 	const userName = document.createElement('div');
// 	userName.textContent = user_info.name;
// 	userName.style.fontFamily = '"Horizon", monospace';
// 	userName.style.webkitTextStroke = '0.1rem #ffffff';
// 	userName.style.color = 'transparent';
// 	userName.style.fontSize = 'clamp(18px, 2.5vw, 26px)';
// 	userName.style.whiteSpace = 'nowrap';
// 	userInfoContainer.appendChild(userName);

// 	const userStats = document.createElement('div');
// 	userStats.textContent = `Games: ${stats.total_matches} W: ${stats.wins} L: ${stats.losses}`;
// 	userStats.style.fontFamily = '"RobotoCondensed", monospace';
// 	userStats.style.color = 'white';
// 	userStats.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
// 	userStats.style.whiteSpace = 'nowrap';
// 	userInfoContainer.appendChild(userStats);

// 	return userInfoContainer;
// }

function createDashboardButton(userID: number): HTMLButtonElement {
	const dashboardBtn = document.createElement('button');
	styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
	dashboardBtn.addEventListener("click", () => {
		navigateTo(`Dashboard?userId=${userID}`);
	});
	return dashboardBtn;
}

function createNotificationButtons(): HTMLButtonElement {
	const notificationsBtn = document.createElement('button');
	notificationsBtn.id = 'notificationBtn';

	const notificationBtnList = document.createElement('ul');
	notificationBtnList.id = 'notificationBtnList';
	notificationBtnList.style.display = 'none';
	notificationBtnList.style.zIndex = '100';
	notificationBtnList.style.position = 'absolute';
	notificationBtnList.style.border = '3px solid #403f3f';
	notificationBtnList.style.borderRadius = '5px';
	notificationBtnList.style.margin = '0';
	notificationBtnList.style.listStyle = 'none';
	notificationBtnList.style.padding = '8px 0';
	notificationBtnList.style.background = '#2a2927';
	notificationBtnList.style.boxShadow = 'rgba(30, 30, 30, 1) 0px 20px 30px -10px';
	notificationBtnList.style.width = '210px';
	notificationBtnList.style.height = '200px';

	styleListBtns(notificationsBtn, 'url("../../images/notifications.png")');
	notificationsBtn.addEventListener("click", () => {
		if (notificationBtnList.style.display === 'none') {
			notificationBtnList.style.display = 'block';
		} else {
			notificationBtnList.style.display = 'none';
		}
		console.log('Notifications clicked');
	});

	const notificationBadge = document.createElement('span');
	notificationBadge.id = 'notificationBadge';
	notificationBadge.style.position = 'relative';
	notificationBadge.style.top = '-10px';
	notificationBadge.style.right = '-8px';
	notificationBadge.style.background = '#ff4444';
	notificationBadge.style.color = 'white';
	notificationBadge.style.borderRadius = '50%';
	notificationBadge.style.fontSize = '10px';
	notificationBadge.style.width = '18px';
	notificationBadge.style.height = '18px';
	notificationBadge.style.display = 'none';
	notificationBadge.style.alignItems = 'center';
	notificationBadge.style.justifyContent = 'center';

	notificationsBtn.appendChild(notificationBadge);
	notificationsBtn.appendChild(notificationBtnList);
	return notificationsBtn;
}

function createTopRightButtonContainer(): HTMLDivElement {
	const topRightButtons = document.createElement('div');
	topRightButtons.style.display = 'flex';
	topRightButtons.style.width = '100%';
	topRightButtons.style.flexDirection = 'row';
	topRightButtons.style.gap = '0.5rem';
	topRightButtons.style.justifyContent = 'flex-end';
	topRightButtons.style.alignItems = 'flex-start';
	topRightButtons.style.padding = '1rem';
	return topRightButtons;
}

function createUserContainer(user_info: any, stats: any, playerNr: number): HTMLDivElement {
	const userContainer = document.createElement('div');
	userContainer.style.display = 'flex';
	userContainer.style.width = '100%';
	userContainer.style.height = '50%';

	const userPic = createUserPicture(user_info);
	userContainer.appendChild(userPic);

	const userInfoContainer = document.createElement('div');
	userInfoContainer.style.display = 'flex';
	userInfoContainer.style.flexDirection = 'column';
	userInfoContainer.style.gap = '0.7rem';
	userInfoContainer.style.height = '30%';
	userInfoContainer.style.padding = '1rem';

	const userName = document.createElement('div');
	userName.id = `userNameMenu${playerNr}`;
	userName.textContent = user_info.id < 2 ? "Guest" : user_info.name;
	userName.style.fontFamily = '"Horizon", monospace';
	userName.style.webkitTextStroke = '0.1rem #ffffff';
	userName.style.color = 'transparent';
	userName.style.fontSize = 'clamp(18px, 2.5vw, 26px)';
	userName.style.whiteSpace = 'nowrap';
	userInfoContainer.appendChild(userName);

	if (user_info.id >= 2) {
		const userStats = document.createElement('div');
		userStats.textContent = `Games: ${stats.total_matches} W: ${stats.wins} L: ${stats.losses}`;
		userStats.style.fontFamily = '"RobotoCondensed", monospace';
		userStats.style.color = 'white';
		userStats.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
		userStats.style.whiteSpace = 'nowrap';
		userInfoContainer.appendChild(userStats);
	}
	const topRightButtonContainer =  createTopRightButtonContainer();
	if(user_info.id >= 2) {
		const dashboard = createDashboardButton(user_info.id);
		topRightButtonContainer.appendChild(dashboard);
	}
	if (playerNr === 1) {
		const notifications = createNotificationButtons();
		topRightButtonContainer.appendChild(notifications);
	}
	userContainer.appendChild(userInfoContainer);
	userContainer.appendChild(topRightButtonContainer);
	return userContainer;
}

function createButtonsContainer(playerNr: number): HTMLDivElement {
	const buttonsContainer = document.createElement('div');
	buttonsContainer.style.display = 'flex';
	buttonsContainer.style.flexDirection = 'row';
	buttonsContainer.style.width = '100%';
	buttonsContainer.style.height = '35%';
	buttonsContainer.style.justifyContent = 'space-between';
	buttonsContainer.style.gap = '1rem';
	buttonsContainer.style.alignItems = 'center';
	if (playerNr == 1) {
		buttonsContainer.appendChild(styleBtnUserMenu(get2faBtn(playerNr)));
		buttonsContainer.appendChild(styleBtnUserMenu(getAvatarBtn(playerNr)));
		buttonsContainer.appendChild(styleBtnUserMenu(getChangeNameBtn(playerNr))); //Merel will built this
	}
	buttonsContainer.appendChild(styleBtnUserMenu(getLoginBtn(playerNr)));
	return buttonsContainer;
}

function renderUserCardMenu(user1_info: any, user1_stats: any, user2_info: any, user2_stats: any) {
	const user1_block = document.getElementById('user1_block');
	const user2_block = document.getElementById('user2_block');
	if (!user1_block || !user2_block) {
		console.error('Required user blocks not found');
		return;
	}
	clearUserBlocks(user1_block, user2_block);
	setupBlockStyling(user1_block, user2_block);
	const { tabContainer1, tabContainer2 } = createTabs();
	const user1Container = createUserContainer(user1_info, user1_stats, 1);
	const user2Container = createUserContainer(user2_info, user2_stats, 2);

	const buttonsContainer1 = createButtonsContainer(1); // Player 1 doesn't get login button
	const buttonsContainer2 = createButtonsContainer(2);  // Player 2 gets login button

	user1_block.parentElement?.insertBefore(tabContainer1, user1_block);
	user1_block.appendChild(user1Container);
	user1_block.appendChild(buttonsContainer1);
	
	user2_block.parentElement?.insertBefore(tabContainer2, user2_block);
	user2_block.appendChild(user2Container);
	user2_block.appendChild(buttonsContainer2);
}

export function actionUserDataMenu(data: any) {
	console.log('Action to get UserDataMenu')
	if (!data.subaction) {
		console.error('No subaction in userDataMenu data');
		return ;
	} else if (data.subaction === 'receivedUserDataMenu') {
		renderUserCardMenu(data.user_info1, data.stats1, data.user_info2, data.stats2); ;
	} else {
		console.log(`Unknown subaction in playerInfo: ${data.subaction}`);
	}
}