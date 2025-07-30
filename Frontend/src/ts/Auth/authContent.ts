import { submitAuthForm, loginSuccessfull, changeLoginMode, addGuest } from './userAuth.js'
import { log } from '../logging.js'
import { Game } from '../script.js'
import * as S from '../structs.js'

export function getAuthField(player: number, mandatory: boolean): HTMLElement {
	const authContainer = document.createElement('div');
	authContainer.className = 'authContainer';
	authContainer.id = 'auth' + player;

	const action = mandatory ? 'Sign Up' : 'Login';
	const usernameField = action === 'Login' ? '' : `
		<div class="inputSingle">
			<label for="username">Username</label>
			<div class="inputWithIcon">
				<input type="text" id="username" placeholder=""/>
			</div>
		</div>`;

	const pongTextDivs = Array.from({length: 10}, () =>
		`<div class="pongText">Pong</div>`
	).join('');

	authContainer.innerHTML = `
		<form class="loginSignUpContainer">
			<div class="header">
				<div class="header1Text">${action}</div>
			</div>
			<div class="inputMultiple">
				${usernameField}
			<div class="inputSingle">
				<label for="email">Email</label>
				<div class="inputWithIcon">
					<input type="email" id="email" placeholder="" />
				</div>
			</div>
			<div class="inputSingle">
				<label for="password">Password</label>
				<div class="inputWithIcon">
					<input type="password" id="password" placeholder="" />
				</div>
			</div>
			<button type="submit" class="submitButton">${action}</button>
			<p class="loginSignUpPrompt">
				${action === "Login" ? "Don't have an account?" : "Have an account?"}
				<span class="loginSignUpLink">${action === 'Login' ? 'Sign Up' : 'Login'}</span>
			</p>
			</div>
		</form>
		<div class="animationContainer">
			${pongTextDivs}
			<div class="ball"></div>
		</div>`;
		return authContainer;
}



// export function getAuthField(player: number, mandatoy: Boolean) {
// 	const	auth = document.createElement('div');
// 	auth.id = 'auth' + player;
// 	auth.style.backgroundColor = 'lightblue';
// 	auth.style.width = '50%';
// 	auth.style.height = '100%';
// 	auth.style.position = 'relative';
// 	auth.style.display = 'flex';
// 	auth.style.flexDirection = 'column';
// 	auth.style.alignItems = 'center';
// 	auth.style.zIndex = '999';
// 	if (player == 2) {
// 		auth.style.backgroundColor = 'lightgreen';
// 	}

// 	const	authTitle = document.createElement('h2');
// 	authTitle.id = 'authTitle' + player;
// 	authTitle.textContent = 'Sign Up Player' + player;

// 	const authForm = document.createElement('form');
// 	authForm.id = 'authForm' + player;

// 	const nameField = document.createElement('div');
// 	nameField.id = 'nameField' + player;
// 	nameField.classList.add('formInput');

// 	const nameLabel = document.createElement('label');
// 	nameLabel.htmlFor = 'name';
// 	nameLabel.textContent = 'Username: ';

// 	const nameInput = document.createElement('input');
// 	nameInput.type = 'text';
// 	nameInput.id = 'name' + player;
// 	nameInput.name = 'name';
// 	// nameInput.required = true;

// 	nameField.append(nameLabel, nameInput);

// 	const emailField = document.createElement('div');
// 	emailField.classList.add('formInput');

// 	const emailLabel = document.createElement('label');
// 	emailLabel.htmlFor = 'email';
// 	emailLabel.textContent = 'Email: ';

// 	const emailInput = document.createElement('input');
// 	emailInput.type = 'email';
// 	emailInput.id = 'email' + player;
// 	emailInput.name = 'email';
// 	// emailInput.required = true;

// 	emailField.append(emailLabel, emailInput);

// 	const passwordField = document.createElement('div');
// 	passwordField.classList.add('formInput');

// 	const passwordLabel = document.createElement('label');
// 	passwordLabel.htmlFor = 'password';
// 	passwordLabel.textContent = 'Password: ';

// 	const passwordInput = document.createElement('input');
// 	passwordInput.type = 'password';
// 	passwordInput.id = 'password'  + player;
// 	passwordInput.name = 'password';
// 	// passwordInput.required = true;

// 	passwordField.append(passwordLabel, passwordInput);

// 	const submitBtnDiv = document.createElement('div');
// 	submitBtnDiv.id = 'submitBtnDiv' + player;

// 	const submitBtn = document.createElement('button');
// 	submitBtn.id = 'submitBtn' + player;
// 	submitBtn.type = 'submit';
// 	submitBtn.textContent = 'Sign Up Player ' + player;
// 	submitBtnDiv.appendChild(submitBtn);

// 	if (!mandatoy) {
// 		const guestBtn = document.createElement('button');
// 		guestBtn.id = 'guestBtn' + player;
// 		guestBtn.textContent = 'Guest';
// 		submitBtnDiv.appendChild(guestBtn);
// 	}

// 	authForm.append(nameField, emailField, passwordField, submitBtnDiv);

// 	const modeLabel = document.createElement('p');
// 	modeLabel.id = 'modelabel' + player;
// 	modeLabel.textContent = 'Sign Up mode';

// 	const toggleBtn = document.createElement('button');
// 	toggleBtn.type = 'button';
// 	toggleBtn.id = 'toggle-mode' + player;
// 	toggleBtn.textContent = 'Switch to Login';

// 	const googleAuth = document.createElement('button');
// 	googleAuth.type = 'button';
// 	googleAuth.id = 'google-login-btn' + player;
// 	googleAuth.textContent = 'Login with Google';

// 	auth.append(authTitle, authForm, modeLabel, toggleBtn, googleAuth);
// 	return (auth);
// }

export function getLoginFields(player: number) {
	const	body = document.getElementById('body');
	if (!body)
		return ;
	body.style.height = "100vh";
	body.style.backgroundColor = "#ededeb";
	body.style.justifyContent = "center";
	body.appendChild(getAuthField(1, true));

	document.getElementById('authForm' + player)?.addEventListener('submit', (e) => submitAuthForm(e, player));
	document.getElementById('google-login-btn' + player)?.addEventListener('click', (e) => {
		window.location.href = 'https://localhost:8443/api/auth/google?player=' + player;
	});

	// document.getElementById('toggle-mode' + player)?.addEventListener('click', (e) => changeLoginMode(player));
}
