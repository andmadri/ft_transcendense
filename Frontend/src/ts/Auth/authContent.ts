import { submitAuthForm, loginSuccessfull, changeLoginMode, addGuest } from './userAuth.js'
import { log } from '../logging.js'
import { removeMenu } from '../Menu/menuContent.js'
import { Game } from '../script.js'
import * as S from '../structs.js'

export function getAuthField(player: number, mandatoy: Boolean) {
	const	auth = document.createElement('div');
	auth.id = 'auth' + player;
	auth.style.backgroundColor = 'lightblue';
	auth.style.width = '50%';
	auth.style.height = '100%';
	auth.style.position = 'center';
	auth.style.display = 'flex';
	auth.style.flexDirection = 'column';
	auth.style.alignItems = 'center';
	auth.style.zIndex = '999';
	if (player == 2) {
		auth.style.left = '50%';
		auth.style.backgroundColor = 'lightgreen';
	}

	const	authTitle = document.createElement('h2');
	authTitle.id = 'authTitle' + player;
	authTitle.textContent = 'Sign Up Player' + player;

	const authForm = document.createElement('form');
	authForm.id = 'authForm' + player;

	const nameField = document.createElement('div');
	nameField.id = 'nameField' + player;
	nameField.classList.add('formInput');

	const nameLabel = document.createElement('label');
	nameLabel.htmlFor = 'name';
	nameLabel.textContent = 'Username: ';

	const nameInput = document.createElement('input');
	nameInput.type = 'text';
	nameInput.id = 'name' + player;
	nameInput.name = 'name';
	// nameInput.required = true;

	nameField.append(nameLabel, nameInput);

	const emailField = document.createElement('div');
	emailField.classList.add('formInput');

	const emailLabel = document.createElement('label');
	emailLabel.htmlFor = 'email';
	emailLabel.textContent = 'Email: ';

	const emailInput = document.createElement('input');
	emailInput.type = 'email';
	emailInput.id = 'email' + player;
	emailInput.name = 'email';
	// emailInput.required = true;

	emailField.append(emailLabel, emailInput);

	const passwordField = document.createElement('div');
	passwordField.classList.add('formInput');

	const passwordLabel = document.createElement('label');
	passwordLabel.htmlFor = 'password';
	passwordLabel.textContent = 'Password: ';

	const passwordInput = document.createElement('input');
	passwordInput.type = 'password';
	passwordInput.id = 'password'  + player;
	passwordInput.name = 'password';
	// passwordInput.required = true;

	passwordField.append(passwordLabel, passwordInput);

	const submitBtnDiv = document.createElement('div');
	submitBtnDiv.id = 'submitBtnDiv' + player;

	const submitBtn = document.createElement('button');
	submitBtn.id = 'submitBtn' + player;
	submitBtn.type = 'submit';
	submitBtn.textContent = 'Sign Up Player ' + player;
	submitBtnDiv.appendChild(submitBtn);

	if (!mandatoy) {
		const guestBtn = document.createElement('button');
		guestBtn.id = 'guestBtn' + player;
		guestBtn.textContent = 'Guest';
		submitBtnDiv.appendChild(guestBtn);
	}

	authForm.append(nameField, emailField, passwordField, submitBtnDiv);

	const modeLabel = document.createElement('p');
	modeLabel.id = 'modelabel' + player;
	modeLabel.textContent = 'Sign Up mode';

	const toggleBtn = document.createElement('button');
	toggleBtn.type = 'button';
	toggleBtn.id = 'toggle-mode' + player;
	toggleBtn.textContent = 'Switch to Login';

	const googleAuth = document.createElement('button');
	googleAuth.type = 'button';
	googleAuth.id = 'google-login-btn' + player;
	googleAuth.textContent = 'Login with Google';

	auth.append(authTitle, authForm, modeLabel, toggleBtn, googleAuth);
	return (auth);
}

export function getLoginFields() {
	if (document.getElementById('menu'))
		removeMenu();

	const	body = document.getElementById('body');
	if (!body)
		return ;

	if (Game.opponentType == S.OT.Online) { // one login mandatory
		const auth = getAuthField(1, true); 
		body.appendChild(auth);
	} else {
		if (Game.opponentType == S.OT.ONEvsONE) { // two login not mandatory
		body.append(getAuthField(1, false), getAuthField(2, false));
		} else if (Game.opponentType == S.OT.ONEvsCOM) { // one login not mandatory
			body.appendChild(getAuthField(1, false));
		}
	}

	// addEventListeners for Login form
	document.getElementById('authForm1')?.addEventListener('submit', (e) => submitAuthForm(e, 1));
	document.getElementById('authForm2')?.addEventListener('submit', (e) => submitAuthForm(e, 2));
	document.getElementById('google-login-btn1')?.addEventListener('click', (e) => {
		window.location.href = 'https://localhost:8443/api/auth/google?player=1';
		
	});
	document.getElementById('google-login-btn2')?.addEventListener('click', (e) => {
		window.location.href = 'https://localhost:8443/api/auth/google?player=2';
	});
	document.getElementById('toggle-mode1')?.addEventListener('click', (e) => changeLoginMode(1));
	document.getElementById('toggle-mode2')?.addEventListener('click', (e) => changeLoginMode(2));
	document.getElementById('guestBtn1')?.addEventListener('click', (e) => addGuest(e, 1));
	document.getElementById('guestBtn2')?.addEventListener('click', (e) => addGuest(e, 2));
}

export function removeAuthField(player: number) {
	const	body = document.getElementById('body');
	const	auth = document.getElementById('auth' + player);
	
	if (body && auth)
		body.removeChild(auth);

}

