import { submitAuthForm } from './userAuth.js'
import { log } from '../logging.js'
import * as S from '../structs.js'
import { movePadel } from '../Game/gameLogic.js';
import { navigateTo } from '../history.js';
import { text } from 'stream/consumers';

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

function getInputField(label_name: string, name: string, player: number) {
	const inputSingle = document.createElement('div');
	inputSingle.className = 'inputSingle';

	const inputWithIcon = document.createElement('div');
	inputWithIcon.className = "inputWithIcon";

	const input = document.createElement('input');
	input.type = name;
	input.id = `${name}${player}`;
	input.name = name;

	const label = document.createElement('label');
	label.setAttribute('for', name);
	label.textContent = label_name;

	inputWithIcon.appendChild(input);
	inputSingle.append(label, inputWithIcon);
	return (inputSingle);
}

export function getAuthField(player: number, mandatory: boolean): HTMLElement {
	const action = authenticationMode;

	const authContainer = document.createElement('div');
	authContainer.className = 'authContainer';
	authContainer.id = 'auth' + player;

	const authForm = document.createElement('form');
	authForm.id = `authForm${player}`;
	authForm.className = "loginSignUpContainer"

	const headerAuthForm = document.createElement('div');
	headerAuthForm.className = "header";

	const header1Text = document.createElement('div');
	header1Text.className = "header1Text";
	header1Text.id = 'header1TextAuth'
	header1Text.textContent = action;

	headerAuthForm.appendChild(header1Text);

	const inputMultiple = document.createElement('div');
	inputMultiple.className = "inputMultiple";

	if (action != "Login")
		inputMultiple.append(getInputField("Username", "name", player));
	inputMultiple.append(getInputField("Email", 'email', player), getInputField("Password", 'password', player))

	const inputButtons = document.createElement('div');
	inputButtons.className = "inputButtons";

	const submitBtn = document.createElement('button');
	submitBtn.type = "submit";
	submitBtn.className = "submitButton";
	submitBtn.textContent = action;

	const spanMsg = document.createElement('span');
	spanMsg.textContent = "  or via social network";

	const imgGoogle = document.createElement('img');
	imgGoogle.src = "css/icons/icons8-google.svg";
	imgGoogle.id = `google-login-btn${player}`;
	imgGoogle.alt = "GoogleLogin";
	imgGoogle.className = "googleLoginButton";

	const textLogin = document.createElement('p');
	textLogin.className = "loginSignUpPrompt";
	textLogin.textContent = `${action === "Login" ? "Don't have an account? " : "Have an account? "}`

	const spanTextLogin = document.createElement('span');
	spanTextLogin.textContent = `${action === 'Login' ? 'Sign Up' : 'Login'}`;
	spanTextLogin.className = "loginSignUpLink"

	textLogin.appendChild(spanTextLogin);
	inputButtons.append(submitBtn, spanMsg, imgGoogle, textLogin);
	authForm.append(headerAuthForm, inputMultiple, inputButtons);

	const animationContainer = document.createElement('div');
	animationContainer.className = "animationContainer";

	const ball = document.createElement('div');
	ball.className = "ball";

	for (let i = 0; i < 8; i++) {
		const pongDiv = document.createElement('div');
		pongDiv.className = "pongText";
		pongDiv.textContent = "Pong";
		animationContainer.appendChild(pongDiv);
	}
	animationContainer.appendChild(ball);

	authContainer.append(authForm, animationContainer);
	return (authContainer);
}

export function getLoginFields(player: number) {
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	body.style.justifyContent = 'center';
	body.style.alignItems = 'center';
	body.innerHTML = '';
	body.appendChild(getAuthField(player, true));

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
