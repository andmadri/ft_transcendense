import * as S from './structs.js'
import { Game, log } from './script.js'

let mode: ('login' | 'sign up') = 'sign up';

export function changeLoginMode() {
	mode = mode === 'login' ? 'sign up' : 'login';
	const modeLabel = document.getElementById('modelabel');
	const nameField = document.getElementById('nameField');
	const nameInput = document.getElementById('name') as HTMLInputElement | null;
	const submitButton = document.getElementById('submitBtn');
	const toggleButton = document.getElementById('toggle-mode');
	const authTitle = document.getElementById('authTitle');
	if (modeLabel)
		modeLabel.textContent = mode === 'login' ? 'Login mode' : 'Sign Up mode';
	if (nameField && nameInput) {
		if (mode === 'login') {
			nameField.style.display = 'none';
			nameInput.required = false;
		} else {
			nameField.style.display = 'block';
			nameInput.required = true;
		}
	}
	if (submitButton)
		submitButton.textContent = mode === 'login' ? 'Login' : 'sign up';
	if (toggleButton)
		toggleButton.textContent = mode === 'login' ? 'Switch to Sign Up' : 'Switch to Login';
	if (authTitle)
		authTitle.textContent = mode === 'login' ? 'Login' : 'sign up';
}

export function submitAuthForm(e: Event) {
	log("submit auth form");
	e.preventDefault();
	const name = (document.querySelector<HTMLInputElement>('#name')?.value ?? '').trim();
	const email = (document.querySelector<HTMLInputElement>('#email')?.value ?? '').trim();
	const password = (document.querySelector<HTMLInputElement>('#password')?.value ?? '').trim();

	if (!email || !password || (mode == 'sign up' && !name)) {
		log("alert?");
		alert("Please fill in all required fileds");
		return;
	}
	const msg = mode == 'sign up'
		? {action: 'signUpUser', name, email, password}
		: {action: 'loginUser', email, password};
	Game.socket.send(JSON.stringify(msg));
}

export function loginSuccessfull() {
	console.log("Login Successfull");
	const popup = document.getElementById('auth');
	if (popup)
		popup.style.display = 'none';
	const game = document.getElementById('game');
	if (game)
		game.style.display = 'block';

	Game.loggedIn = true;
}