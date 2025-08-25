import { submitAuthForm } from './userAuth.js'
import { log } from '../logging.js'
import * as S from '../structs.js'
import { movePadel } from '../Game/gameLogic.js';
import { navigateTo } from '../history.js';

export let authenticationMode = 'Sign Up';

export function changeAuthMode(player: number) {
	authenticationMode = (authenticationMode === 'Sign Up') ? 'Login' : 'Sign Up';
	const authContainer = document.getElementById('auth' + player);
	if (authContainer) {
		const newAuth = getAuthField(player, true);
		authContainer.replaceWith(newAuth);
	document.getElementById('authForm' + player)?.addEventListener('submit', (e) => submitAuthForm(e, player));
	document.getElementById('google-login-btn' + player)?.addEventListener('click', (e) => {
		window.location.href = `https://${S.host}/api/auth/google?player=` + player;
	});
	document.querySelector(`#auth${player} .loginSignUpLink`)?.addEventListener('click', (e) => changeAuthMode(player));
	}
}

export function getAuthField(player: number, mandatory: boolean): HTMLElement {
	const authContainer = document.createElement('div');
	authContainer.className = 'authContainer';
	authContainer.id = 'auth' + player;

	// const action = mandatory ? 'Sign Up' : 'Login';
	const action = authenticationMode;
	const usernameField = action === 'Login' ? '' : `
		<div class="inputSingle">
			<label for="name">Username</label>
			<div class="inputWithIcon">
				<input type="text" id="name${player}" name="name"/>
			</div>
		</div>`;

	const pongTextDivs = Array.from({length: 8}, () =>
		`<div class="pongText">Pong</div>`
	).join('');

	authContainer.innerHTML = `
		<form class="loginSignUpContainer" id="authForm${player}">
			<div class="header">
				<div class="header1Text">${action}</div>
			</div>
			<div class="inputMultiple">
				${usernameField}
			<div class="inputSingle">
				<label for="email">Email</label>
				<div class="inputWithIcon">
					<input type="email" id="email${player}" name="email" />
				</div>
			</div>
			<div class="inputSingle">
				<label for="password">Password</label>
				<div class="inputWithIcon">
					<input type="password" id="password${player}" name="password" />
				</div>
			</div>
			</div>
			<div class="inputButtons">
				<button type="submit" class="submitButton" >${action}</button>
				<span> or via social network</span>
				<img src="css/icons/icons8-google.svg" id="google-login-btn${player}" class="googleLoginButton">
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

export function getLoginFields(player: number) {
	const	app = document.getElementById('app');
	if (!app)
		return ;
	app.style.height = "100vh";
	app.style.backgroundColor = "#ededeb";
	app.style.justifyContent = "center";
	app.appendChild(getAuthField(player, true));

	// addEventListeners for Login form
	document.getElementById('authForm' + player)?.addEventListener('submit', (e) => submitAuthForm(e, player));
	document.getElementById('google-login-btn' + player)?.addEventListener('click', (e) => {
		window.location.href = `https://${S.host}/api/auth/google?player=` + player;
	});

	document.querySelector(`#auth${player} .loginSignUpLink`)?.addEventListener('click', (e) => {
		navigateTo('LoginP' + (player === 1 ? 1 : 2));
		changeAuthMode(player);
	});
}
