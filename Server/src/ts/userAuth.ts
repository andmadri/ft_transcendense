import * as S from './structs.js'
import { Game } from './script.js'

let mode: ('login' | 'register') = 'login';

document.getElementById('toggle-mode')?.addEventListener('click', () => {
	mode = mode === 'login' ? 'register' : 'login';
	const modeLabel = document.getElementById('modelabel');
	const nameField = document.getElementById('nameField');
	const submitButton = document.getElementById('submitBtn')
	const toggleButton = document.getElementById('toggle-mode')
	if (modeLabel)
		modeLabel.textContent = mode === 'login' ? 'Login mode' : 'Register mode';
	if (nameField)
		nameField.style.display = mode === 'login' ? 'none' : 'block';
	if (submitButton)
		submitButton.textContent = mode === 'login' ? 'Login' : 'Register';
	if (toggleButton)
		toggleButton.textContent = mode === 'login' ? 'Switch to Sign Up' : 'Switch to Login';
})

document.getElementById('nameField')!.style.display = 'none';

export function submitAuthForm(e: Event) {
	e.preventDefault();
	const name = (document.querySelector<HTMLInputElement>('#name')?.value ?? '').trim();
	const email = (document.querySelector<HTMLInputElement>('#email')?.value ?? '').trim();
	const password = (document.querySelector<HTMLInputElement>('#password')?.value ?? '').trim();

	if (!email || !password || (mode == 'register' && !name)) {
		alert("Please fill in all required fileds");
		return;
	}
	const msg = mode == 'register'
		? {action: 'registerUser', name, email, password}
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