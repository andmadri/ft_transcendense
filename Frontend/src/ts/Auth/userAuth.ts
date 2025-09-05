import * as S from '../structs.js'
import { UI, Game } from '../gameData.js'
import { log } from '../logging.js'
// import { updatePlayerData } from '../SideMenu/updatePlayerData.js'
import { authenticationMode, changeAuthMode } from './authContent.js'
import { navigateTo } from '../history.js';

export async function submitAuthForm(e: Event, player: number) {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const playerNr = player || 1;
	const username = (form.querySelector<HTMLInputElement>(`#name${player}`)?.value ?? '').trim();
	const email = (form.querySelector<HTMLInputElement>(`#email${player}`)?.value ?? '').trim();
	const password = (form.querySelector<HTMLInputElement>(`#password${player}`)?.value ?? '').trim();

	const isSignup = authenticationMode === 'Sign Up';
	const endpoint = isSignup ? '/api/signup' : '/api/login';

	if (!email || !password || (isSignup && !username)) {
		alert("Please fill in all required fields");
		return;
	}

	const payload = isSignup
		? { playerNr, username, email, password }
		: { playerNr, email, password };

	log(`Submitting ${isSignup ? 'sign up' : 'login'} form for player ${playerNr}`);
	try {
			const response = await fetch(`https://${S.host}${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			log(`Authentication successful for player ${playerNr}: ${data.message || ''}`);

			if (endpoint == "/api/login")
				if (data.twofaPending)
					await requestTwofaCode(playerNr, data.userId);
				else {
					log(`No 2FA required for player ${playerNr}, logging in directly.`);
					loginSuccessfull(playerNr, data.userId, data.name, data.twofa);
				}
			else
				changeAuthMode(playerNr);

		} else {
			log(`Authentication failed for player ${playerNr}: ${response.statusText}`);
			const error = await response.json();
			alert(error.message || "Authentication failed");
		}
	} catch (err) {
		alert("Network error during authentication");
	}
}

export function loginSuccessfull(player: number, userId: number, name: string, twofa: boolean) {
	document.getElementById('auth1')?.remove();
	document.getElementById('auth2')?.remove();
	if (player == 1) {
		log("Login Successfull (player one) with id: " + userId);
		UI.user1.ID = userId;
		UI.user1.name = name;
		UI.user1.Twofa = twofa;
	}
	else if (player == 2) {
		log("Login Successfull (player two) with id: " + userId);
		UI.user2.ID = userId;
		UI.user2.name = name;
		UI.user2.Twofa = twofa;
	}
	document.getElementById('menu')?.remove();
	Game.socket.disconnect();
	Game.socket.connect();
	navigateTo('Menu');
}

async function requestTwofaCode(playerNr: number, userId: number) {
	log(`Requesting 2FA code for player ${playerNr} with userId ${userId}`);

	// Create overlay
	const overlay = document.createElement('div');
	Object.assign(overlay.style, {
		position: 'fixed',
		top: '0',
		left: '0',
		width: '100vw',
		height: '100vh',
		background: 'rgba(0,0,0,0.7)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: '1000'
	});

	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'X';
	Object.assign(closeBtn.style, {
		position: 'absolute',
		top: '30px',
		right: '30px',
		fontSize: '2em',
		background: 'transparent',
		border: 'none',
		color: 'white',
		cursor: 'pointer'
	});
	closeBtn.addEventListener('click', () => overlay.remove());
	overlay.appendChild(closeBtn);

	const formDiv = document.createElement('div');
	Object.assign(formDiv.style, {
		background: 'white',
		padding: '30px',
		borderRadius: '10px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	});

	const label = document.createElement('div');
	label.textContent = 'Enter your 6-digit 2FA code:';
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
	submitBtn.textContent = 'Verify 2FA';
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
			const response = await fetch(`https://${S.host}/api/2fa/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ playerNr, userId, token: code }),
				credentials: 'include'
			});
			const data = await response.json();
			if (response.ok && data.success) {
				label.textContent = '2FA validated successfully!';
				codeInput.remove();
				submitBtn.remove();
				setTimeout(() => {
					overlay.remove();
				}, 1000); // 1000 ms = 1 second
				loginSuccessfull(playerNr, userId, data.name, data.twofa);
			} else {
				alert(data.message || '2FA verification failed.');
			}
		} catch (err) {
			alert('Error verifying 2FA.');
		}
	});

	formDiv.appendChild(form);
	overlay.appendChild(formDiv);
	const body = document.getElementById('body');
	body?.appendChild(overlay);
}
