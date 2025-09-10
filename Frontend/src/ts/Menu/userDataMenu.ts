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

function styleTabButton(button: HTMLButtonElement) {
	button.style.textAlign = 'center';
	button.style.fontFamily = '"Horizon", sans-serif';
	button.style.fontSize = 'clamp(12px, 1.2vw, 16px)';
	button.style.cursor = 'pointer';
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

function createDashboardButton(): HTMLButtonElement {
	const dashboardBtn = document.createElement('button');
	styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
	dashboardBtn.addEventListener("click", () => {
		navigateTo('Dashboard');
	});
	return dashboardBtn;
}

function createNotificationButtons(): HTMLButtonElement {
	const notificationsBtn = document.createElement('button');
	notificationsBtn.id = 'notificationBtn';
	styleListBtns(notificationsBtn, 'url("../../images/notifications.png")');
	notificationsBtn.addEventListener("click", () => {
		// Add notifications logic here
		console.log('Notifications clicked');
	});
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
	// if (user_info.id < 2) {
	// 	return userContainer;
	// }
	// const userInfoContainer = createUserInfoSection(user_info, stats); //fix this
	// userContainer.appendChild(userInfoContainer);

	const userInfoContainer = document.createElement('div');
	userInfoContainer.style.display = 'flex';
	userInfoContainer.style.flexDirection = 'column';
	userInfoContainer.style.gap = '0.7rem';
	userInfoContainer.style.height = '30%';
	userInfoContainer.style.padding = '1rem';

	const userName = document.createElement('div');
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
		const dashboard = createDashboardButton();
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



// function renderUserCardMenu(user_info: any, stats: any, playerNr: number)
// {
// 	const users1_block = document.getElementById('user1_block');
// 	if (!users1_block)
// 		return ;

// 	const users2_block = document.getElementById('users2_block');
// 	if (!users2_block)
// 		return ;


// 	users1_block.style.borderRadius = '0px 0px 10px 10px';
// 	users2_block.style.borderRadius = '0px 0px 10px 10px';

// 	const tabContainer1 = document.createElement('div');
// 	tabContainer1.style.display = 'flex';
// 	tabContainer1.style.marginBottom = '-16px'; // Overlap with users1_block
// 	tabContainer1.style.position = 'relative';


// 	const tabContainer2 = document.createElement('div');
// 	tabContainer2.style.display = 'flex';
// 	tabContainer2.style.marginBottom = '-16px'; // Overlap with users2_block but idk if it should be -16 or more?
// 	tabContainer2.style.position = 'relative';

// 	const player1Tab = document.createElement('button');
// 	player1Tab.textContent = '1';
// 	styleTabButton(player1Tab, playerNr === 1);

// 	const player2Tab = document.createElement('button');
// 	player2Tab.textContent = '2';
// 	styleTabButton(player2Tab, playerNr === 2);

// 	tabContainer1.appendChild(player1Tab);
// 	tabContainer2.appendChild(player2Tab);
// //------------------------------------------------------------
// 	const user1Container = document.createElement('div');
// 	user1Container.style.display = 'flex';
// 	user1Container.style.width = '100%';
// 	user1Container.style.height = '50%';

// 	const buttonsContainerUser1 = document.createElement('div');
// 	buttonsContainerUser1.style.display = 'flex';
// 	buttonsContainerUser1.style.flexDirection = 'row';
// 	buttonsContainerUser1.style.width = '100%';
// 	buttonsContainerUser1.style.height = '35%';
// 	buttonsContainerUser1.style.justifyContent = 'space-between';
// 	buttonsContainerUser1.style.gap = '1rem';
// 	buttonsContainerUser1.style.alignItems = 'center';
// 	// buttonsContainerUser1.style.margin = '1rem';

// 	const user1Pic = document.createElement('img');
// 	user1Pic.src = `/api/avatar/${user_info.id}`;
// 	user1Pic.alt = `${user_info.name}'s avatar`;
// 	user1Pic.style.height = 'clamp(60px, 90%, 120px)';
// 	user1Pic.style.aspectRatio = '1/1';
// 	user1Pic.style.objectFit = 'cover';
// 	user1Pic.style.borderRadius = '50%';
// 	// user1Pic.style.padding = '1rem';
// 	user1Pic.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';

// 	const user1InfoContainer = document.createElement('div');
// 	user1InfoContainer.style.display = 'flex';
// 	user1InfoContainer.style.flexDirection = 'column';
// 	user1InfoContainer.style.gap = '0.7rem';
// 	user1InfoContainer.style.height = '30%';
// 	user1InfoContainer.style.padding = '1rem';

// 	const user1Name = document.createElement('div');
// 	user1Name.textContent = `${user_info.name}`;
// 	user1Name.style.fontFamily = '"Horizon", monospace';
// 	user1Name.style.webkitTextStroke = '0.1rem #ffffff';
// 	user1Name.style.color = 'transparent';
// 	user1Name.style.fontSize = 'clamp(18px, 2.5vw, 26px)';
// 	user1Name.style.whiteSpace = 'nowrap';

// 	const user1Stats = document.createElement('div');
// 	user1Stats.textContent = `Games: ${stats.total_matches} W: ${stats.wins} L: ${stats.losses}`;
// 	user1Stats.style.fontFamily = '"RobotoCondensed", monospace';
// 	user1Stats.style.color = 'white';
// 	user1Stats.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
// 	user1Stats.style.whiteSpace = 'nowrap';


// 	const topRightButtons = document.createElement('div');
// 	topRightButtons.style.display = 'flex';
// 	topRightButtons.style.width = '100%';
// 	topRightButtons.style.flexDirection = 'row';
// 	topRightButtons.style.gap = '0.5rem';
// 	topRightButtons.style.justifyContent = 'flex-end'; // Align to the right
// 	topRightButtons.style.alignItems = 'flex-start';
// 	topRightButtons.style.padding = '1rem';


// 	const dashboardBtn = document.createElement('button');
// 	styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
// 	// dashboardBtn.style.width = 'clamp(26px, 1.5vw, 40px)';
// 	dashboardBtn.addEventListener("click", () => {
// 		navigateTo('Dashboard');
// 	});

// 	const notificationsBtn = document.createElement('button');
// 	styleListBtns(notificationsBtn, 'url("../../images/notifications.png")');
// 	// dashboardBtn.style.width = 'clamp(26px, 1.5vw, 40px)';
// 	dashboardBtn.addEventListener("click", () => {
// 		navigateTo('Dashboard');
// 	});

// 	topRightButtons.appendChild(dashboardBtn);
// 	topRightButtons.appendChild(notificationsBtn);

// 	user1InfoContainer.appendChild(user1Name);
// 	user1InfoContainer.appendChild(user1Stats);

// 	user2InfoContainer.appendChild(user2Name);
// 	user2InfoContainer.appendChild(user2Stats);

// 	buttonsContainerUser1.appendChild(styleBtnUserMenu(get2faBtn(playerNr)));
// 	buttonsContainerUser1.appendChild(styleBtnUserMenu(getAvatarBtn(playerNr)));
// 	buttonsContainerUser1.appendChild(styleBtnUserMenu(getLoginBtn(playerNr)));

// 	buttonsContainerUser1.appendChild(styleBtnUserMenu(getLoginBtn(playerNr)));
	
//   user1Container.appendChild(user1Pic);
//   user1Container.appendChild(user1InfoContainer);
// 	user1Container.appendChild(topRightButtons);

// 	user2Container.appendChild(user2Pic);
//   user2Container.appendChild(user2InfoContainer);
// 	// user2Container.appendChild(topRightButtons); only attach the dashboard button to the topRightButton for player2


// 	users1_block.parentElement?.insertBefore(tabContainer1, users1_block);
// 	users2_block.parentElement?.insertBefore(tabContainer2, users2_block);

// 	users1_block.appendChild(user1Container);
// 	users1_block.appendChild(buttonsContainerUser1);

// 	users2_block.appendChild(user2Container);
// 	users2_block.appendChild(buttonsContainerUser2);
// }

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