import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { updatePlayerData } from '../SideMenu/updatePlayerData.js'

type	Mode = 'login' | 'sign up';
const	modes: Record<number, Mode> = { 1: 'sign up', 2: 'sign up' };

function updateLoginPlayer(data: any) {
	if (data.player == 1) {
		if (data.userId)
			Game.id = data.userId;
		if (data.userName)
			Game.name = data.userName;
		Game.playerLogin = 1;
		Game.player1Login = true;
		updatePlayerData(1);

	} else {
		if (data.UserId)
			Game.id2 = data.UserId;
		if (data.userName)
			Game.name2 = data.userName;
		Game.player2Login = true;
		Game.playerLogin = 2;
		updatePlayerData(2);
	}
}

export function processLogin(data: any) {
	if (data.access && data.access == "yes") {
		log("Process Login Check => player: " + data.player);
		// set cookie with WSS
		document.cookie = `jwtAuthToken=${data.reason}; path=/; max-age=${60 * 60}; secure; samesite=Lax`;
		updateLoginPlayer(data);
		loginSuccessfull(data.player);
	}
	else
		log('Not logged in: ' + data.reason);
}


export function changeLoginMode(player: number) {
	modes[player] = modes[player] == 'login' ? 'sign up' : 'login';

	const modeLabel = document.getElementById('modelabel' + player);
	const nameField = document.getElementById('nameField' + player);
	const nameInput = document.getElementById('name' + player) as HTMLInputElement | null;
	const submitButton = document.getElementById('submitBtn' + player);
	const toggleButton = document.getElementById('toggle-mode' + player);
	const authTitle = document.getElementById('authTitle' + player);
	
	if (modeLabel)
		modeLabel.textContent = modes[player] === 'login' ? 'Login mode' : 'Sign Up mode';

	if (nameField && nameInput) {
		if (modes[player] === 'login') {
			nameField.style.display = 'none';
			nameInput.required = false;
		} else {
			nameField.style.display = 'block';
			nameInput.required = true;
		}
	}

	if (submitButton)
		submitButton.textContent = modes[player] === 'login' ? 'Login' : 'Sign up';
	if (toggleButton)
		toggleButton.textContent = modes[player] === 'login' ? 'Switch to Sign Up' : 'Switch to Login';
	if (authTitle)
		authTitle.textContent = modes[player] === 'login' ? 'Login' : 'Sign up';
}

export async function submitAuthForm(e: Event, player: number) {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const playerNr = player || 1;
	const username = (form.querySelector<HTMLInputElement>(`#name${player}`)?.value ?? '').trim();
	const email = (form.querySelector<HTMLInputElement>(`#email${player}`)?.value ?? '').trim();
	const password = (form.querySelector<HTMLInputElement>(`#password${player}`)?.value ?? '').trim();

	// Determine mode from label or your own state
	const isSignup = document.getElementById(`modelabel${player}`)?.textContent?.toLowerCase().includes('sign up');
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
		const response = await fetch(`https://localhost:8443${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			log(`Authentication successful for player ${playerNr}: ${data.message || ''}`);

			if (endpoint == "/api/login")
				loginSuccessfull(playerNr);
			else
				changeLoginMode(playerNr);

		} else {
			log(`Authentication failed for player ${playerNr}: ${response.statusText}`);
			const error = await response.json();
			alert(error.message || "Authentication failed");
		}
	} catch (err) {
		alert("Network error during authentication");
	}
}


export function loginSuccessfull(player: number) {
	log("players logged in: " + Game.player1Login + " " + Game.player2Login);
	if (player == 1) {
		log("Login Successfull (player one)");
		Game.player1Login = true;
		Game.state = S.State.Menu;
	}
	else if (player == 2) {
		log("Login Successfull (player two)");
		Game.player2Login = true;
		Game.state = S.State.Init;
	}
	log("players logged in: " + Game.player1Login + " " + Game.player2Login);
}

export function addGuest(e: Event, player: number) {
	e.preventDefault();

	if (player == 1) {
		Game.name = "Guest 1";
		Game.id = 0;
		Game.player1Login = true;
	} else if (player == 2) {
		Game.name2 = "Guest 2";
		Game.id2 = 0;
		Game.player2Login = true;
	}
	loginSuccessfull(player);
	updatePlayerData(0);
}
