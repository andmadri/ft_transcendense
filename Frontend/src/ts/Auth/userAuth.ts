import * as S from '../structs.js'
import { UI, Game } from '../gameData.js'
import { log } from '../logging.js'
import { updatePlayerData } from '../SideMenu/updatePlayerData.js'
import { getOnlineList } from '../Menu/online.js';
import { getFriendsList } from '../Menu/friends.js';
import { startSocketListeners } from '../socketEvents.js'
import { authenticationMode, changeAuthMode } from './authContent.js'

type	Mode = 'login' | 'sign up';
const	modes: Record<number, Mode> = { 1: 'sign up', 2: 'sign up' };

function updateLoginPlayer(data: any) {
	if (data.player == 1) {
		if (data.userId)
			Game.match.player1.ID = data.userId;
		if (data.userName)
			Game.match.player1.name = data.userName;
		Game.match.player1.login = true;
		updatePlayerData(1);

	} else {
		if (data.UserId)
			Game.match.player2.ID = data.UserId;
		if (data.userName)
			Game.match.player2.name = data.userName;
		Game.match.player2.login = true;
		updatePlayerData(2);
	}
}

// export function changeLoginMode(player: number) {
// 	modes[player] = modes[player] == 'login' ? 'sign up' : 'login';

// 	const modeLabel = document.getElementById('modelabel' + player);
// 	const nameField = document.getElementById('nameField' + player);
// 	const nameInput = document.getElementById('name' + player) as HTMLInputElement | null;
// 	const submitButton = document.getElementById('submitBtn' + player);
// 	const toggleButton = document.getElementById('toggle-mode' + player);
// 	const authTitle = document.getElementById('authTitle' + player);

// 	if (modeLabel)
// 		modeLabel.textContent = modes[player] === 'login' ? 'Login mode' : 'Sign Up mode';

// 	if (nameField && nameInput) {
// 		if (modes[player] === 'login') {
// 			nameField.style.display = 'none';
// 			nameInput.required = false;
// 		} else {
// 			nameField.style.display = 'block';
// 			nameInput.required = true;
// 		}
// 	}

// 	if (submitButton)
// 		submitButton.textContent = modes[player] === 'login' ? 'Login' : 'Sign up';
// 	if (toggleButton)
// 		toggleButton.textContent = modes[player] === 'login' ? 'Switch to Sign Up' : 'Switch to Login';
// 	if (authTitle)
// 		authTitle.textContent = modes[player] === 'login' ? 'Login' : 'Sign up';
// }

export async function submitAuthForm(e: Event, player: number) {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const playerNr = player || 1;
	const username = (form.querySelector<HTMLInputElement>(`#name${player}`)?.value ?? '').trim();
	const email = (form.querySelector<HTMLInputElement>(`#email${player}`)?.value ?? '').trim();
	const password = (form.querySelector<HTMLInputElement>(`#password${player}`)?.value ?? '').trim();

	// Determine mode from label or your own state
	// const isSignup = document.getElementById(`modelabel${player}`)?.textContent?.toLowerCase().includes('sign up');
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
				loginSuccessfull(playerNr, data.userId, data.name);
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

export function loginSuccessfull(player: number, userId: number, name: string) {
	document.getElementById('auth1')?.remove();
	document.getElementById('auth2')?.remove();
	if (player == 1) {
		log("Login Successfull (player one) with id: " + userId);
		Game.match.player1.ID = userId;
		Game.match.player1.name = name;
		Game.match.player1.login = true;
	}
	else if (player == 2) {
		log("Login Successfull (player two) with id: " + userId);
		Game.match.player2.ID = userId;
		Game.match.player2.name = name;
		Game.match.player2.login = true;
	}
	UI.state = S.stateUI.Menu;
	log("players logged in: " + Game.match.player1.login + " " + Game.match.player2.login);
}

// export function addGuest(e: Event, player: number) {
// 	e.preventDefault();

// 	if (player == 1) {
// 		Game.match.player1.login = true;
// 	} else if (player == 2) {
// 		Game.match.player2.login = true;
// 	}
// 	loginSuccessfull(player, 0, 'Guest ' + player);
// 	updatePlayerData(0);
// }
