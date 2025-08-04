import { changeOpponentType, changeMatchFormat, startGame } from '../Game/initGame.js';
import { Game } from '../script.js'
import { getFriendsList } from './friends.js';
import { getOnlineList } from './online.js';
import { getStatsList } from './stats.js';
import { getHighscores } from './highscore.js'
import { getOptionMenu  } from '../OptionMenu/options.js';
import { submitLogout } from '../Auth/logout.js';
import { getCreditBtn } from './credits.js';
import { getRightSideMenuWithTabs } from './menuPlayercards.js';
import { changeAvatar } from './avatar.js';
import { log } from '../logging.js';
import * as S from '../structs.js';

export function styleElement(e: HTMLElement, styles: Partial<CSSStyleDeclaration>) {

	Object.assign(e.style, styles);
}

function getLeftSideMenu() {
	const menuLeft = document.createElement('div');
	styleElement(menuLeft, {
		display: 'flex',
		flexDirection: 'column',
		width: '40%',
		boxSizing: 'border-box',
		justifyContent: 'space-between',
		height: '100%',
		flex: '1',
	});

	const highScoreOnlineDiv = document.createElement('div');
	styleElement(highScoreOnlineDiv, {
		display: 'flex',
		gap: '15px',
		flexGrow: '1',
	});
	highScoreOnlineDiv.append(getHighscores(), getOnlineList());

	menuLeft.append(highScoreOnlineDiv); // , getCreditBtn()
	return (menuLeft);
}

function getPlayBtn(): HTMLButtonElement {
	const playBtn = document.createElement('button');
	playBtn.textContent = 'Play game';
	styleElement(playBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		borderRadius: '10px',
		width: '60%',
	});
	playBtn.addEventListener('click', () => {
		getOptionMenu();
	});

	return (playBtn);
}

function getLoginBtn(playerNr: number): HTMLButtonElement {
	const loginBtn = document.createElement('button');
	loginBtn.textContent = 'login';
	styleElement(loginBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		borderRadius: '10px',
		marginLeft: 'auto',
		marginBottom: '10px',
		fontFamily: 'inherit'
	});
	loginBtn.addEventListener('click', () => {
		log('Login button clicked for player ' + playerNr);
		if (playerNr == 2)
			Game.state = S.State.LoginP2;
		else 
			Game.state = S.State.LoginP1;
	});
	return (loginBtn);
}

function getLogoutBtn(playerNr: number): HTMLButtonElement {
	const logoutBtn = document.createElement('button');
	logoutBtn.textContent = 'logout';
	styleElement(logoutBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		borderRadius: '10px',
		marginLeft: 'auto',
		marginBottom: '10px',
		fontFamily: 'inherit'
	});
	logoutBtn.addEventListener('click', (e) => submitLogout(e, playerNr));
	return (logoutBtn);
}

function getAvatarBtn(playerNr: number): HTMLLabelElement {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = 'image/*';
	fileInput.style.display = 'none';
	fileInput.addEventListener('change', (e) => {
		const file = fileInput.files?.[0];
		if (file)
			changeAvatar(file, playerNr);
	});

	const label = document.createElement('label');
	label.textContent = 'Change Avatar';
	label.htmlFor = fileInput.id = `avatarUpload${playerNr}`;

	styleElement(label, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		borderRadius: '10px',
		marginLeft: 'auto',
		display: 'inline-block',
		fontFamily: 'inherit'
	});
	label.appendChild(fileInput);
	return (label);
}

export function getRightSideMenu(playerNr: number) {
	const profile = document.createElement('div');
	profile.id = 'profile';
	styleElement(profile, {
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
		padding: '15px',
		width: '100%',
		boxSizing: 'border-box',
		backgroundColor: 'white',
		flex: '1.5',
		borderRadius: '10px',
		alignItems: 'stretch'
	});

	const player = document.createElement('div');
	styleElement(player, {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
		gap: '10px'
	})

	const avatarDiv = document.createElement('div');
	styleElement(avatarDiv, {
		flex: '0 0 25%',
		textAlign: 'center',
	})

	const avatarImg = document.createElement('img');
	const userId = playerNr === 1 ? Game.player1Id : Game.player2Id;
	avatarImg.src = `/api/avatar/${userId}`;
	styleElement(avatarImg, {
		maxWidth: '120px',
		maxHeight: '120px',
		width: '100%',
		height: 'auto',
		objectFit: 'cover',
		// borderRadius: '50%', // optional: makes the avatar round
	});
	avatarDiv.appendChild(avatarImg);

	const playernameAndButtons = document.createElement('div');
	styleElement(playernameAndButtons, {
		flex: '1',
		display: 'flex',
		gap: '5px',
	});

	const playername = document.createElement('div');
	playername.id = "playerNameMenu";
	if (playerNr == 1)
		playername.textContent = Game.player1Name;
	else
		playername.textContent = Game.player2Name;
	playername.style.fontSize = '1.5em';

	const buttons = document.createElement('div');
	styleElement(buttons, {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '15px',
		marginLeft: 'auto'
	});
	buttons.append(getLoginBtn(playerNr), getLogoutBtn(playerNr), getAvatarBtn(playerNr));

	playernameAndButtons.append(playername, buttons);
	player.append(avatarDiv, playernameAndButtons);

	const statsFriendsDiv = document.createElement('div');
	styleElement(statsFriendsDiv, {
		display: 'flex',
		gap: '20px',
		alignItems: 'stretch'
	});
	statsFriendsDiv.append(getStatsList(playerNr), getFriendsList(playerNr));

	profile.append(player, statsFriendsDiv); // , getPlayBtn()
	return (profile);
}

export function getMenu() {
	const menu = document.createElement('div');
	menu.id = 'menu';
	styleElement(menu, {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#ffd400',
		padding: '20px',
		height: '100%',
		width: '100%',
		boxSizing: 'border-box'
	});
	const titleMenu = document.createElement('h2');
	titleMenu.textContent = 'Menu';
	titleMenu.style.marginTop = '10px';

	const leftRight = document.createElement('div');
	styleElement(leftRight, {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: '20px',
		flex: '1'
	})

	leftRight.append(getLeftSideMenu(), getRightSideMenuWithTabs());
	menu.append(titleMenu, leftRight);

	// Add Play button under the right menu, styled like the Credit button
	const bottomButtonDiv = document.createElement('div');
	styleElement(bottomButtonDiv, {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		marginTop: '10px',
	});
	bottomButtonDiv.appendChild(getCreditBtn());
	bottomButtonDiv.appendChild(getPlayBtn());
	menu.appendChild(bottomButtonDiv);

	const app = document.getElementById('app');
	if (!app)
		return ;
	app.innerHTML = '';
	app.appendChild(menu);
}
