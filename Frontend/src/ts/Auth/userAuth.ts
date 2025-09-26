import * as S from '../structs.js'
import { UI, Game } from '../gameData.js'
import { log } from '../logging.js'
import { authenticationMode, changeAuthMode } from './authContent.js'
import { navigateTo } from '../history.js';
import { getLoadingPage } from '../Loading/loadContent.js';
import { customAlert } from '../Alerts/customAlert.js';



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
		customAlert("Please fill in all required fields"); //needed customAlert
		return;
	}

	const payload = isSignup
		? { playerNr, username, email, password }
		: { playerNr, email, password };

	console.log(`Submitting ${isSignup ? 'sign up' : 'login'} form for player ${playerNr}`);
	try {
		const response = await fetch(`https://${S.host}${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			console.log(`Authentication successful for player ${playerNr}: ${data.message || ''}`);

			if (endpoint == "/api/login")
				if (data.twofaPending)
					await requestTwofaCode(playerNr, data.userId);
				else {
					console.log(`No 2FA required for player ${playerNr}, logging in directly.`);
					loginSuccessfull(playerNr, data.userId, data.name, data.twofa);
				}
			else
				changeAuthMode(playerNr);

		} else {
			console.log(`Authentication failed for player ${playerNr}: ${response.statusText}`);
			const error = await response.json();
			customAlert(error.message || "Authentication failed");  //needed customAlert
		}
	} catch (err) {
		console.error('NETWORK_ERROR', 'Network error during sign up', 'submitAuthForm');
	}
}

export function loginSuccessfull(player: number, userId: number, name: string, twofa: boolean) {
	document.getElementById('auth1')?.remove();
	document.getElementById('auth2')?.remove();
	if (player == 1) {
		console.log("Login Successfull (player one) with id: " + userId);
		UI.user1.ID = userId;
		UI.user1.name = name;
		UI.user1.Twofa = twofa;
	}
	else if (player == 2) {
		console.log("Login Successfull (player two) with id: " + userId);
		UI.user2.ID = userId;
		UI.user2.name = name;
		UI.user2.Twofa = twofa;
	}
	document.getElementById('menu')?.remove();
	if (!document.getElementById('loadingpage')) {
		getLoadingPage();
	}
	Game.socket.disconnect();
	Game.socket.connect();

	// Wait till connected to the socket server
	Game.socket.once("connect", () => {
		console.log("Connection with the server!");
		navigateTo("Menu");
	});
}

async function requestTwofaCode(playerNr: number, userId: number) {
	console.log(`Requesting 2FA code for player ${playerNr} with userId ${userId}`);

	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.background = 'rgba(0,0,0,0.25)';
	overlay.style.display = 'flex';
	overlay.style.flexDirection = 'column';
	overlay.style.justifyContent = 'center';
	overlay.style.alignItems = 'center';
	overlay.style.zIndex = '1000';
	overlay.addEventListener('click', () => overlay.remove());
	
	const formDiv = document.createElement('div');
	formDiv.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	formDiv.style.padding = '40px';
	formDiv.style.borderRadius = '10px';
	formDiv.style.display = 'flex';
	formDiv.style.border = '12px solid black';
	formDiv.style.flexDirection = 'column';
	formDiv.style.alignItems = 'center';
	formDiv.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	formDiv.style.position = 'relative';
	formDiv.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'X';
	closeBtn.style.position = 'absolute';
	closeBtn.style.top = '0px';
	closeBtn.style.right = '0px';
	closeBtn.style.fontFamily = '"Horizon", sans-serif';
	closeBtn.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
	closeBtn.style.background = 'transparent';
	closeBtn.style.border = 'none';
	closeBtn.style.color = 'black';
	closeBtn.style.cursor = 'pointer';
	closeBtn.addEventListener('click', () => overlay.remove());
	formDiv.appendChild(closeBtn);

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
	codeInput.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	codeInput.style.textAlign = 'center';
	codeInput.style.margin = '10px 0';
	codeInput.style.borderRadius = '5px';
	codeInput.style.background = '#363430';
	codeInput.style.border = 'none';
	codeInput.style.color = 'white';
	codeInput.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	form.appendChild(codeInput);

	const submitBtn = document.createElement('button');
	submitBtn.type = 'submit';
	submitBtn.textContent = 'Verify 2FA';
	submitBtn.style.border = 'none';
	submitBtn.style.borderRadius = '5px';
	submitBtn.style.textAlign = 'center';
	submitBtn.style.fontFamily = '"RobotoCondensed", sans-serif';
	submitBtn.style.color = 'white';
	submitBtn.style.background = '#363430';
	submitBtn.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	submitBtn.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	form.appendChild(submitBtn);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const code = codeInput.value.trim();
		if (!/^\d{6}$/.test(code)) {
			customAlert('Please enter a valid 6-digit code.'); //needed customAlert
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
				customAlert(data.message || '2FA verification failed.'); //needed customAlert
			}
		} catch (err) {
			customAlert('Error verifying 2FA.'); //needed customAlert
		}
	});

	formDiv.appendChild(form);
	overlay.appendChild(formDiv);
	const body = document.getElementById('body');
	body?.appendChild(overlay);
}
