import { changeOpponentType, changeMatchFormat, startGame } from '../Game/initGame.js';
import { Game } from '../script.js'
import { getSideMenu } from '../SideMenu/SideMenuContent.js';
import { getFriendsList } from './friends.js';
import { getOnlineList } from './online.js';
import { getStatsList } from './stats.js';
import { getHighscores } from './highscore.js'
import { getOptionMenu  } from '../OptionMenu/options.js';
import { submitLogout } from '../Auth/logout.js';
import { getCreditBtn } from './credits.js';

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

	menuLeft.append(highScoreOnlineDiv, getCreditBtn());
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
		borderRadius: '10px'
	});
	playBtn.addEventListener('click', () => {
		getOptionMenu();
	});

	return (playBtn);
}

function getLogoutBtn(): HTMLButtonElement {
	const logoutBtn = document.createElement('button');
	logoutBtn.textContent = 'logout';
	styleElement(logoutBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		borderRadius: '10px',
		marginLeft: 'auto'
	});
	logoutBtn.addEventListener('click', (e) => submitLogout(e, 1));
	return (logoutBtn);
}

function getRightSideMenu() {
	const profile = document.createElement('div');
	profile.id = 'profile';
	styleElement(profile, {
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
		padding: '15px',
		width: '50%',
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
	avatarDiv.textContent = '😎'; // AVATAR!
	styleElement(avatarDiv, {
		flex: '0 0 25%',
		textAlign: 'center',
		fontSize: '50px'
	})

	const playernameAndLogout = document.createElement('div');
	styleElement(playernameAndLogout, {
		flex: '1',
		display: 'flex',
		gap: '5px',
	});
	
	const playername = document.createElement('div');
	playername.id = "playerNameMenu";
	playername.textContent = Game.name;
	playername.style.fontSize = '1.5em';

	playernameAndLogout.append(playername, getLogoutBtn());
	player.append(avatarDiv, playernameAndLogout);

	const statsFriendsDiv = document.createElement('div');
	styleElement(statsFriendsDiv, {
		display: 'flex',
		gap: '20px',
		alignItems: 'stretch'
	});
	statsFriendsDiv.append(getStatsList(), getFriendsList());

	profile.append(player, statsFriendsDiv, getPlayBtn());
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
	
	leftRight.append(getLeftSideMenu(), getRightSideMenu());
	menu.append(titleMenu, leftRight);
	const app = document.getElementById('app');
	if (!app)
		return ;
	app.innerHTML = '';
	app.appendChild(menu);
}
