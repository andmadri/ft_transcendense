import * as S from './structs.js'
import { Game } from './script.js'

export function submitInlogForm(e: Event) {
	e.preventDefault();
	const nameElement = document.querySelector<HTMLInputElement>('#name');
	const emailElement = document.querySelector<HTMLInputElement>('#email');
	const passwordElement = document.querySelector<HTMLInputElement>('#password');

	// Send to backend
	const msg = {
		action: 'loginCheck',
		email: emailElement?.value ?? '',
		name: nameElement?.value ?? '',
		password: passwordElement?.value ?? ''
	}
	Game.socket.send(JSON.stringify(msg));
}

export function loginSuccessfull() {
	// to hide the login popup and show the game
	console.log("login successfull!!");
	const popup = document.getElementById('inlog');
	if (popup)
		popup.style.display = 'none';
	const game = document.getElementById('game');
	if (game)
		game.style.display = 'block';

	Game.loggedIn = true;
}