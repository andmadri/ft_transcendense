import { get2faBtn, getLoginBtn, getAvatarBtn } from "./userDataMenuButtons";

function styleBtnUserMenu(button: HTMLButtonElement): HTMLButtonElement {
	button.style.display = 'flex';
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	button.style.cursor = 'pointer';
	button.style.textAlign = 'center';
	button.style.borderRadius = '10px';
	button.style.fontSize = 'clamp(10px, 1.5vw, 17px)';
	button.style.padding = '0.7rem';
	button.style.color = 'black';
	button.style.border = 'none';
	button.style.alignItems = 'center';
	button.style.justifyContent = 'center';
	// button.style.height = '50%';
	button.style.flex = '1 1';
	return button;
}

function renderUserCardMenu(user_info: any, stats: any, playerNr: number)
{
	const card = document.getElementById('user_block');
	if (!card)
		return ;

  const container = document.createElement('div');
  container.style.display = 'flex';
  // container.style.alignItems = 'center';
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
	buttonsContainer.style.margin = '1rem';

  const userPic = document.createElement('img');
  userPic.src = `/api/avatar/${user_info.id}`;
  userPic.alt = `${user_info.name}'s avatar`;
  userPic.style.height = 'clamp(60px, 90%, 120px)';
  userPic.style.aspectRatio = '1/1';
  userPic.style.objectFit = 'cover';
  userPic.style.borderRadius = '50%';
  userPic.style.padding = '1rem';

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

  userInfoContainer.appendChild(userName);
  userInfoContainer.appendChild(userStats);
	buttonsContainer.appendChild(styleBtnUserMenu(get2faBtn(playerNr)));
	// buttonsContainer.appendChild(styleBtnUserMenu(getAvatarBtn(playerNr)));
	buttonsContainer.appendChild(styleBtnUserMenu(getLoginBtn(playerNr)));

  container.appendChild(userPic);
  container.appendChild(userInfoContainer);
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