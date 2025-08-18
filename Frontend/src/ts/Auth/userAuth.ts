import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
// import { updatePlayerData } from '../SideMenu/updatePlayerData.js'
import { authenticationMode, changeAuthMode } from './authContent.js'

// type	Mode = 'login' | 'sign up';
// const	modes: Record<number, Mode> = { 1: 'sign up', 2: 'sign up' };

// function updateLoginPlayer(data: any) {
// 	if (data.player == 1) {
// 		if (data.userId)
// 			Game.player1Id = data.userId;
// 		if (data.userName)
// 			Game.player1Name = data.userName;
// 		Game.playerLogin = 1;
// 		Game.player1Login = true;
// 		updatePlayerData(1);

// 	} else {
// 		if (data.UserId)
// 			Game.player2Id = data.UserId;
// 		if (data.userName)
// 			Game.player2Name = data.userName;
// 		Game.player2Login = true;
// 		Game.playerLogin = 2;
// 		updatePlayerData(2);
// 	}
// }

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
		const response = await fetch(`https://${S.host}:8443${endpoint}`, {
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

export function loginSuccessfull(playerNr: number, userId: number, name: string, twofa: boolean) {
	document.getElementById('auth1')?.remove();
	document.getElementById('auth2')?.remove();
	if (playerNr == 1) {
		log("Login Successfull playerNr: " + playerNr + " with id: " + userId);
		Game.player1Id = userId;
		Game.player1Name = name;
		Game.player1Login = true;
		Game.player1Twofa = twofa;
	}
	else if (playerNr == 2) {
		log("Login Successfull playerNr: " + playerNr + " with id: " + userId);
		Game.player2Id = userId;
		Game.player2Name = name;
		Game.player2Login = true;
		Game.player2Twofa = twofa;
	}
	Game.state = S.State.Menu;
	document.getElementById('menu')?.remove();
	log("playerNr 1 logged in: " + Game.player1Login + "\n playerNr 2 logged in: " + Game.player2Login);
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
			const response = await fetch(`https://${S.host}:8443/api/2fa/verify`, {
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
	document.body.appendChild(overlay);
}