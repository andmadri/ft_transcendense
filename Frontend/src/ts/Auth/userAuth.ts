import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { updatePlayerData } from '../SideMenu/updatePlayerData.js'
import { authenticationMode, changeAuthMode } from './authContent.js'

// type	Mode = 'login' | 'sign up';
// const	modes: Record<number, Mode> = { 1: 'sign up', 2: 'sign up' };

function updateLoginPlayer(data: any) {
	if (data.player == 1) {
		if (data.userId)
			Game.player1Id = data.userId;
		if (data.userName)
			Game.player1Name = data.userName;
		Game.playerLogin = 1;
		Game.player1Login = true;
		updatePlayerData(1);

	} else {
		if (data.UserId)
			Game.player2Id = data.UserId;
		if (data.userName)
			Game.player2Name = data.userName;
		Game.player2Login = true;
		Game.playerLogin = 2;
		updatePlayerData(2);
	}
}

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
		Game.player1Id = userId;
		Game.player1Name = name;
		Game.player1Login = true;
	}
	else if (player == 2) {
		log("Login Successfull (player two) with id: " + userId);
		Game.player2Id = userId;
		Game.player2Name = name;
		Game.player2Login = true;
	}
	Game.state = S.State.Menu;
	log("players logged in: " + Game.player1Login + " " + Game.player2Login);
}
