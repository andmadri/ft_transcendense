import { submitAuthForm, loginSuccessfull, changeLoginMode } from './userAuth.js' //imports two functions from login.js
import { log } from '../logging.js'

export function getAuthField() {
	const	body = document.getElementById('body');
	if (!body)
		return ;

	log('get AuthField');
	const	auth = document.createElement('div');
	auth.id = 'auth';
	auth.style.backgroundColor = 'lightblue';
	auth.style.width = '100%';
	auth.style.height = '100%';
	auth.style.position = 'fixed';
	auth.style.display = 'flex';
	auth.style.flexDirection = 'column';
	auth.style.alignItems = 'center';
	auth.style.zIndex = '999';

	const	authTitle = document.createElement('h2');
	authTitle.id = 'authTitle';
	authTitle.textContent = 'Sign Up';

	const authForm = document.createElement('form');
	authForm.id = 'authForm';

	const nameField = document.createElement('div');
	nameField.id = 'nameField';
	nameField.classList.add('formInput');

	const nameLabel = document.createElement('label');
	nameLabel.htmlFor = 'name';
	nameLabel.textContent = 'Username: ';

	const nameInput = document.createElement('input');
	nameInput.type = 'text';
	nameInput.id = 'name';
	nameInput.name = 'name';
	nameInput.required = true;

	nameField.appendChild(nameLabel);
	nameField.appendChild(nameInput);

	const emailField = document.createElement('div');
	emailField.classList.add('formInput');

	const emailLabel = document.createElement('label');
	emailLabel.htmlFor = 'email';
	emailLabel.textContent = 'Email: ';

	const emailInput = document.createElement('input');
	emailInput.type = 'email';
	emailInput.id = 'email';
	emailInput.name = 'email';
	emailInput.required = true;

	emailField.appendChild(emailLabel);
	emailField.appendChild(emailInput);

	const passwordField = document.createElement('div');
	passwordField.classList.add('formInput');

	const passwordLabel = document.createElement('label');
	passwordLabel.htmlFor = 'password';
	passwordLabel.textContent = 'Password: ';

	const passwordInput = document.createElement('input');
	passwordInput.type = 'password';
	passwordInput.id = 'password';
	passwordInput.name = 'password';
	passwordInput.required = true;

	passwordField.appendChild(passwordLabel);
	passwordField.appendChild(passwordInput);

	const submitBtnDiv = document.createElement('div');
	submitBtnDiv.id = 'submitBtnDiv';

	const submitBtn = document.createElement('button');
	submitBtn.id = 'submitBtn';
	submitBtn.type = 'submit';
	submitBtn.textContent = 'Sign Up';

	submitBtnDiv.appendChild(submitBtn);

	authForm.appendChild(nameField);
	authForm.appendChild(emailField);
	authForm.appendChild(passwordField);
	authForm.appendChild(submitBtnDiv);

	const modeLabel = document.createElement('p');
	modeLabel.id = 'modelabel';
	modeLabel.textContent = 'Sign Up mode';

	const toggleBtn = document.createElement('button');
	toggleBtn.type = 'button';
	toggleBtn.id = 'toggle-mode';
	toggleBtn.textContent = 'Switch to Login';

	auth.appendChild(authTitle);
	auth.appendChild(authForm);
	auth.appendChild(modeLabel);
	auth.appendChild(toggleBtn);
	body.appendChild(auth);

	// addEventListeners for Login form
	document.getElementById('authForm')?.addEventListener('submit', submitAuthForm);
	document.getElementById('toggle-mode')?.addEventListener('click', changeLoginMode);	
}

export function removeAuthField() {
	const	body = document.getElementById('body');
	const	auth = document.getElementById('auth');
	
	log('Remove authfield');
	if (body && auth)
		body.removeChild(auth);

}