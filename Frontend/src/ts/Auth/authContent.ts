import { submitAuthForm, loginSuccessfull, changeLoginMode, addGuest } from './userAuth.js' //imports two functions from login.js
import { log } from '../logging.js'
import { removeMenu } from '../Menu/menuContent.js'
import { Game } from '../script.js'
import * as S from '../structs.js'

function createAuthField(player: number) {
	const	auth = document.createElement('div');

	auth.id = 'auth' + player;
	auth.style.backgroundColor = 'lightblue';
	auth.style.width = '50%';
	auth.style.height = '100%';
	auth.style.position = 'fixed';
	auth.style.display = 'flex';
	auth.style.flexDirection = 'column';
	auth.style.alignItems = 'center';
	auth.style.zIndex = '999';
	if (player == 2) {
		auth.style.left = '50%';
		auth.style.backgroundColor = 'lightgreen';
	}
	return (auth);
}

export function getLoggedInField(player: number) {
	let auth = document.getElementById('auth' + player);
	if (!auth)
		auth = createAuthField(player);

	const	loggedInElement = document.createElement('h2');
	loggedInElement.id = 'loggedIn' + player;
	loggedInElement.textContent = "Player " + player + " is logged in";
	auth.innerHTML = "";

	auth.appendChild(loggedInElement);
	return (auth);
}

export function getAuthField(player: number, mandatoy: Boolean) {
	if (player == 1 && Game.player1Login) {
		return (getLoggedInField(1));
	} else if (player == 2 && Game.player2Login) {
		return (getLoggedInField(2));
	}

	const auth = createAuthField(player);

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

	auth?.append(authTitle, authForm, modeLabel, toggleBtn);
	return (auth);
}

function isAlreadyLoggedIn(minPlayers: number, newState: S.State) {
	if (!Game.player1Login)
		return false;
	if (minPlayers == 2 && !Game.player2Login)
		return false;
	Game.state = newState;
	return true ;
}

function initComputer() {
	Game.player2Login = true;
	Game.id2 = 2;
	Game.name2 = 'Computer';
	Game.score2 = 0;
}

export function getLoginFields() {
	if (document.getElementById('menu'))
		removeMenu();

	const	body = document.getElementById('body');
	if (!body)
		return ;

	switch (Game.opponentType) {
		case (S.OT.Online):
			initComputer();
			if (isAlreadyLoggedIn(1, S.State.Pending))
				return ;
			const auth = getAuthField(1, true); 
			if (!auth)
				return ;
			body.appendChild(auth);
			break ;
		case (S.OT.ONEvsONE):
			if (isAlreadyLoggedIn(2, S.State.Init))
				return ;
			const fieldOne = getAuthField(1, false);
			const fieldTwo = getAuthField(2, false);
			if (fieldOne && fieldTwo) // two login not mandatory
				body.append(fieldOne, fieldTwo);
			break ;
		case (S.OT.ONEvsCOM): // one login not mandatory
			initComputer();
			if (isAlreadyLoggedIn(1, S.State.Init))
				return ;
			const field = getAuthField(1, false);
			if (field)
				body.appendChild(field);
			break ;
		default:
			log("No opponentType")
	}

	// addEventListeners for Login form
	document.getElementById('authForm1')?.addEventListener('submit', (e) => submitAuthForm(e, 1));
	document.getElementById('authForm2')?.addEventListener('submit', (e) => submitAuthForm(e, 2));
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
