import * as S from '../structs.js'
import { Game } from '../script.js'
import { log } from '../logging.js'

type	Mode = 'login' | 'sign up';
const	modes: Record<number, Mode> = { 1: 'sign up', 2: 'sign up' };

// PROCESS INFORMATION FROM SERVER
function processSignUp(data: any) {
	if (data.access && data.access == "yes") {
		log("User is created");
		changeLoginMode(data.player);
	}
	else
		log('Not sign up:' + data.reason);
}

function updateLoginPlayer(data: any) {
	if (data.player == 1) {
		if (data.userId)
			Game.id = data.userId;
		if (data.userName)
			Game.name = data.userName;
		Game.playerLogin = 1;
		Game.player1Login = true;
	} else {
		if (data.UserId)
			Game.id2 = data.UserId;
		if (data.userName)
			Game.name2 = data.userName;
		Game.player2Login = true;
		Game.playerLogin = 2;
	}
}

export function processLogin(data: any) {
	if (data.access && data.access == "yes") {
		log("Process Login Check => player: " + data.player);
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

export function submitAuthForm(e: Event, player: number) {
	e.preventDefault();
	const name = (document.querySelector<HTMLInputElement>('#name' + player)?.value ?? '').trim();
	const email = (document.querySelector<HTMLInputElement>('#email' + player)?.value ?? '').trim();
	const password = (document.querySelector<HTMLInputElement>('#password' + player)?.value ?? '').trim();
	
	if (!email || !password || (modes[player] == 'sign up' && !name)) {
		alert("Please fill in all required fileds");
		return;
	}
	const msg = modes[player] == 'sign up'
		? {action: 'login', subaction: 'signupUser', name, email, password, player: player}
		: {action: 'login', subaction: 'loginUser', email, password, player: player};
	Game.socket.send(JSON.stringify(msg));
}

export function loginSuccessfull(player: number) {
	if (player == 1) {
		log("Login Successfull (player one)");

		if (Game.opponentType == S.OT.ONEvsONE) {
			if (Game.player2Login)
				Game.state = S.State.Init;
		} else if(Game.opponentType == S.OT.Online) {
			Game.state = S.State.Pending;
		} else {
			Game.state = S.State.Init;
		}
	}
	else if (player == 2) {
		log("Login Successfull (player two)");
		if (Game.player1Login)
			Game.state = S.State.Init;
	}
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
}

function logoutPlayer(data: any) {
	log('logoutPlayer:' + `${data.reason}`);
	const msg = {action: 'online', subaction: 'getOnlinePlayers'};
	Game.socket.send(JSON.stringify(msg));
}


export function actionLogin(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}

	switch(data.subaction) {
		case 'login':
			processLogin(data);
			break ;
		case 'signup':
			processSignUp(data);
			break ;
		case 'logout':
			logoutPlayer(data);
			break ;
		default:
			log(`(actionLogin) Unknown action: ${data.subaction}`);
	}
}
