import { changeOpponentType, changeMatchFormat, startGame } from '../Game/initGame.js';
import { Game } from '../script.js'
import { getSideMenu } from '../SideMenu/SideMenuContent.js';
import { getFriendsList } from './friends.js';
import { getOnlineList } from './online.js';
import { getStatsList } from './stats.js';
import { getHighscores } from './highscore.js'
import { getOptionMenu  } from '../OptionMenu/options.js';
import { submitLogout } from '../Auth/logout.js';

export function styleElementMenu(e: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
	Object.assign(e.style, styles);
}

function getCreditBtn(): HTMLDivElement {
	const creditsBtn = document.createElement('div');
	creditsBtn.textContent = 'Credits';
	styleElementMenu(creditsBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		marginTop: '15px',
		borderRadius: '10px',
		textAlign: 'center',
	});
	
	creditsBtn.addEventListener('click', () => {
		const app = document.getElementById('app');
		if (!app)
			return ;
	
		const creditDiv = document.createElement('div');
		creditDiv.id = 'creditDiv';
		styleElementMenu(creditDiv, {
			position: 'fixed',
			width: '100vw',
			height: '100vh',
			top: '0',
			left: '0',
			backgroundColor: 'white',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: '9999'
		})
		

		const creditImg = document.createElement('img');
		creditImg.src = "./../images/Credits.png";
		styleElementMenu(creditImg, {
			maxWidth: '90vw',
			maxHeight: '90vh',
			objectFit: 'contain',
		})

		const closeBtn = document.createElement('button');
		closeBtn.textContent = "CLOSE";
		closeBtn.style.zIndex = '100000';
		closeBtn.style.margin = '10px';

		creditDiv.appendChild(creditImg);
		creditDiv.appendChild(closeBtn);
		app.appendChild(creditDiv);
	
		closeBtn.addEventListener('click', () => {
			app.removeChild(creditDiv);
		})
	})
	return (creditsBtn);
}

function getLeftSideMenu() {
	const menuLeft = document.createElement('div');
	styleElementMenu(menuLeft, {
		display: 'flex',
		flexDirection: 'column',
		width: '40%',
		boxSizing: 'border-box',
		justifyContent: 'space-between',
		height: '100%',
		flex: '1',
	});

	const highScoreOnlineDiv = document.createElement('div');
	styleElementMenu(highScoreOnlineDiv, {
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
	styleElementMenu(playBtn, {
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
	styleElementMenu(logoutBtn, {
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
	styleElementMenu(profile, {
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
		border: '2px solid #d9f0ff',
		padding: '15px',
		width: '50%',
		boxSizing: 'border-box',
		backgroundColor: '#fffbea',
		flex: '1.5',
		borderRadius: '10px',
		alignItems: 'stretch'
	});

	const player = document.createElement('div');
	styleElementMenu(player, {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
		gap: '10px'
	})

	const avatarDiv = document.createElement('div');
	avatarDiv.textContent = '😎';
	styleElementMenu(avatarDiv, {
		flex: '0 0 25%',
		textAlign: 'center',
		fontSize: '50px'
	})

	const playernameAndLogout = document.createElement('div');
	styleElementMenu(playernameAndLogout, {
		flex: '1',
		display: 'flex',
		gap: '5px',
	});
	
	const playername = document.createElement('div');
	playername.textContent = Game.name;
	playername.style.fontSize = '1.5em';

	playernameAndLogout.append(playername, getLogoutBtn());
	player.append(avatarDiv, playernameAndLogout);

	const statsFriendsDiv = document.createElement('div');
	styleElementMenu(statsFriendsDiv, {
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
	styleElementMenu(menu, {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#ffd400',
		padding: '20px',
		height: '100%',
		boxSizing: 'border-box'
	});
	const titleMenu = document.createElement('h2');
	titleMenu.textContent = 'Menu';
	titleMenu.style.marginTop = '10px';

	const leftRight = document.createElement('div');
	styleElementMenu(leftRight, {
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
