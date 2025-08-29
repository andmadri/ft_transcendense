import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { getFriendsList } from './friends.js';
import { getOnlineList } from './online.js';
import { getStatsList } from './stats.js';
import { getHighscores } from './highscore.js'
import { getSettingsPage  } from '../SettingMenu/settings.js';
import { submitLogout } from '../Auth/logout.js';
import { getCreditBtn } from './credits.js';
import { getRightSideMenuWithTabs } from './menuPlayercards.js';
import { changeAvatar } from './avatar.js';
import { log } from '../logging.js';
import { navigateTo } from "../history.js";

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
		// width: '60%',
	});
	playBtn.addEventListener('click', () => { navigateTo('Settings'); });
	return (playBtn);
}

function getDashboardBtn(): HTMLButtonElement {
	const dashboardBtn = document.createElement('button');
	dashboardBtn.textContent = 'Dashboard';
	styleElement(dashboardBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		borderRadius: '10px',
		// width: '60%',
	});
	dashboardBtn.addEventListener('click', () => {
		navigateTo('Dashboard');
	});
	return (dashboardBtn);
}

function getLoginBtn(playerNr: number): HTMLButtonElement {
	if (playerNr == 1 || Game.match.player2.ID != 1)
		return (getLogoutBtn(playerNr));
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
		document.getElementById('menu')?.remove();
		if (playerNr == 2) {
			navigateTo('LoginP2');
		} else { 
			navigateTo('LoginP1');
		}
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

function get2faBtn(playerNr: number): HTMLButtonElement {
	if (Game.match.player1.Twofa && playerNr == 1)
		return (get2faDisableBtn(playerNr));
	return (get2faSetupBtn(playerNr));
}

function get2faDisableBtn(playerNr: number): HTMLButtonElement {
	const twofaDisableBtn = document.createElement('button');
	twofaDisableBtn.textContent = 'Disable 2FA';
	styleElement(twofaDisableBtn, {
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
	twofaDisableBtn.addEventListener('click', async () => {
		log('2FA Disable button clicked for player ' + playerNr);

		// Overlay
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.background = 'rgba(0,0,0,0.7)';
		overlay.style.display = 'flex';
		overlay.style.flexDirection = 'column';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';
		overlay.style.zIndex = '1000';

		const closeBtn = document.createElement('button');
		closeBtn.textContent = 'X';
		closeBtn.style.position = 'absolute';
		closeBtn.style.top = '30px';
		closeBtn.style.right = '30px';
		closeBtn.style.fontSize = '2em';
		closeBtn.style.background = 'transparent';
		closeBtn.style.border = 'none';
		closeBtn.style.color = 'white';
		closeBtn.style.cursor = 'pointer';
		closeBtn.addEventListener('click', () => overlay.remove());
		overlay.appendChild(closeBtn);

		const formDiv = document.createElement('div');
		formDiv.style.background = 'white';
		formDiv.style.padding = '30px';
		formDiv.style.borderRadius = '10px';
		formDiv.style.display = 'flex';
		formDiv.style.flexDirection = 'column';
		formDiv.style.alignItems = 'center';

		const label = document.createElement('div');
		label.textContent = 'Enter your 6-digit 2FA code to disable:';
		label.style.marginBottom = '10px';
		formDiv.appendChild(label);

		const form = document.createElement('form');
		form.style.display = 'flex';
		form.style.flexDirection = 'column';
		form.style.alignItems = 'center';

		const codeInput = document.createElement('input');
		codeInput.type = 'text';
		codeInput.maxLength = 6;
		codeInput.pattern = '\\d{6}';
		codeInput.autocomplete = 'one-time-code';
		codeInput.style.fontSize = '1.5em';
		codeInput.style.textAlign = 'center';
		codeInput.style.margin = '10px 0';
		form.appendChild(codeInput);

		const submitBtn = document.createElement('button');
		submitBtn.type = 'submit';
		submitBtn.textContent = 'Disable 2FA';
		submitBtn.style.fontSize = '1em';
		form.appendChild(submitBtn);

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const code = codeInput.value.trim();
			if (!/^\d{6}$/.test(code)) {
				alert('Please enter a valid 6-digit code.');
				return;
			}
			try {
				const res = await fetch('/api/2fa/disable', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ playerNr, token: code }),
					credentials: 'include'
				});
				const data = await res.json();
				if (data.success) {
					label.textContent = '2FA disabled successfully!';
					form.remove();
					if (data.playerNr == 1)
						Game.match.player1.Twofa = false;
					else
						Game.match.player2.Twofa = false;
					setTimeout(() => overlay.remove(), 1000);
					document.getElementById('menu')?.remove();
				} else {
					alert(data.message || 'Failed to disable 2FA.');
				}
			} catch (err) {
				alert('Error disabling 2FA.');
			}
		});

		formDiv.appendChild(form);
		overlay.appendChild(formDiv);
		const app = document.getElementById('app');
		app?.appendChild(overlay);
	});
	return twofaDisableBtn;
}

function get2faSetupBtn(playerNr: number): HTMLButtonElement {
	const twoFABtn = document.createElement('button');
	twoFABtn.textContent = '2FA';
	styleElement(twoFABtn, {
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
	twoFABtn.addEventListener('click', async () => {
		log('2FA button clicked for player ' + playerNr);

		// Create overlay
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.background = 'rgba(0,0,0,0.7)';
		overlay.style.display = 'flex';
		overlay.style.flexDirection = 'column';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';
		overlay.style.zIndex = '1000';

		const closeBtn = document.createElement('button');
		closeBtn.textContent = 'X';
		closeBtn.style.position = 'absolute';
		closeBtn.style.top = '30px';
		closeBtn.style.right = '30px';
		closeBtn.style.fontSize = '2em';
		closeBtn.style.background = 'transparent';
		closeBtn.style.border = 'none';
		closeBtn.style.color = 'white';
		closeBtn.style.cursor = 'pointer';
		closeBtn.addEventListener('click', () => overlay.remove());
		overlay.appendChild(closeBtn);

		const qrDiv = document.createElement('div');
		qrDiv.style.background = 'white';
		qrDiv.style.padding = '30px';
		qrDiv.style.borderRadius = '10px';
		qrDiv.style.display = 'flex';
		qrDiv.style.flexDirection = 'column';
		qrDiv.style.alignItems = 'center';

		const qrLabel = document.createElement('div');
		qrLabel.textContent = 'Scan this QR code with your Authenticator app:';
		qrLabel.style.marginBottom = '10px';
		qrDiv.appendChild(qrLabel);

		const qrImg = document.createElement('img');
		qrImg.style.width = '200px';
		qrImg.style.height = '200px';
		qrImg.style.marginBottom = '20px';
		qrDiv.appendChild(qrImg);

		// Fetch QR code from backend
		try {
			const res = await fetch('/api/2fa/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ playerNr })
			});
			const data = await res.json();
			if (data.success === false) {
				alert(data.message || 'Failed to generate QR code.');
				return;
			} else if (data.qrCodeDataURL) {
				qrImg.src = data.qrCodeDataURL;
			} else {
				qrLabel.textContent = 'Failed to load QR code.';
			}
		} catch (err) {
			qrLabel.textContent = 'Error loading QR code.';
		}

		// 2FA code input form
		const form = document.createElement('form');
		form.style.display = 'flex';
		form.style.flexDirection = 'column';
		form.style.alignItems = 'center';
		form.style.marginTop = '10px';

		const codeLabel = document.createElement('label');
		codeLabel.textContent = 'Enter 6-digit code:';
		codeLabel.htmlFor = 'twofaCodeInput';
		form.appendChild(codeLabel);

		const codeInput = document.createElement('input');
		codeInput.type = 'text';
		codeInput.id = 'twofaCodeInput';
		codeInput.maxLength = 6;
		codeInput.pattern = '\\d{6}';
		codeInput.autocomplete = 'one-time-code';
		codeInput.style.fontSize = '1.5em';
		codeInput.style.textAlign = 'center';
		codeInput.style.margin = '10px 0';
		form.appendChild(codeInput);

		const submitBtn = document.createElement('button');
		submitBtn.type = 'submit';
		submitBtn.textContent = 'activate 2FA';
		submitBtn.style.fontSize = '1em';
		form.appendChild(submitBtn);

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const code = codeInput.value.trim();
			if (!/^\d{6}$/.test(code)) {
				alert('Please enter a valid 6-digit code.');
				return;
			}
			try {
				const res = await fetch('/api/2fa/activate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token: code })
				});
				const data = await res.json();
				if (data.success) {
					qrImg.remove();
					qrLabel.textContent = '2FA activated successfully!';
					form.remove();
					Game.match.player1.Twofa = playerNr === 1 ? true : Game.match.player1.Twofa;
					setTimeout(() => {
						overlay.remove();
					}, 1000); // 1000 ms = 1 second
					document.getElementById('menu')?.remove();
					// Optionally update UI or state here
				} else {
					alert(data.message || '2FA verification failed.');
				}
			} catch (err) {
				alert('Error verifying 2FA.');
			}
		});

		qrDiv.appendChild(form);
		overlay.appendChild(qrDiv);
		const app = document.getElementById('app')
		app?.appendChild(overlay);
	});
	return (twoFABtn);
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
	const userId = playerNr === 1 ? Game.match.player1.ID : Game.match.player2.ID;
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
	playername.id = "playerNameMenu" + playerNr;
	if (playerNr == 1)
		playername.textContent = Game.match.player1.name;
	else
		playername.textContent = Game.match.player2.name;
	playername.style.fontSize = '1.5em';

	const buttons = document.createElement('div');
	styleElement(buttons, {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '15px',
		marginLeft: 'auto'
	});
	if (playerNr == 1)
		buttons.append(getLoginBtn(playerNr), get2faBtn(playerNr), getAvatarBtn(playerNr));
	else
		buttons.append(getLoginBtn(playerNr), getAvatarBtn(playerNr));

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
	bottomButtonDiv.appendChild(getDashboardBtn());
	menu.appendChild(bottomButtonDiv);

	const app = document.getElementById('app');
	if (!app)
		return ;
	app.removeAttribute('style');
	app.innerHTML = '';
	app.appendChild(menu);
	Game.socket.send({action: 'friends', subaction: 'openFriendRequests', id: Game.match.player1.id, playerNr: 1});
}
