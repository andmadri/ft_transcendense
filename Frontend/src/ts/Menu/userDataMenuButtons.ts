import { Game, UI } from "../gameData";
import { navigateTo } from "../history";
import { submitLogout } from "../Auth/logout";
import { changeAvatar } from "./avatar";
import { getProfileSettings } from "./profileSettings.js";
import { customAlert } from '../Alerts/customAlert.js';


function get2faDisableBtn(playerNr: number): HTMLButtonElement {
	const twofaDisableBtn = document.createElement('button');
	twofaDisableBtn.textContent = 'Disable 2FA';
	twofaDisableBtn.addEventListener('click', async () => {
	console.log('2FA Disable button clicked for player ' + playerNr);

	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.background = 'rgba(0,0,0,0.25)';
	overlay.style.display = 'flex';
	overlay.style.flexDirection = 'column';
	overlay.style.justifyContent = 'center';
	overlay.style.alignItems = 'center';
	overlay.style.zIndex = '1000';
	overlay.addEventListener('click', () => overlay.remove());

	const formDiv = document.createElement('div');
	formDiv.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	formDiv.style.padding = '40px';
	formDiv.style.borderRadius = '10px';
	formDiv.style.display = 'flex';
	formDiv.style.border = '12px solid black';
	formDiv.style.flexDirection = 'column';
	formDiv.style.alignItems = 'center';
	formDiv.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	formDiv.style.position = 'relative';
	formDiv.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'X';
	closeBtn.style.position = 'absolute';
	closeBtn.style.top = '0px';
	closeBtn.style.right = '0px';
	closeBtn.style.fontFamily = '"Horizon", sans-serif';
	closeBtn.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
	closeBtn.style.background = 'transparent';
	closeBtn.style.border = 'none';
	closeBtn.style.color = 'black';
	closeBtn.style.cursor = 'pointer';
	closeBtn.addEventListener('click', () => overlay.remove());
	formDiv.appendChild(closeBtn);

	const label = document.createElement('div');
	label.textContent = 'Enter your 6-digit 2FA code to disable:';
	label.style.marginBottom = '10px';
	formDiv.appendChild(label);

	const form = document.createElement('form');
	form.style.display = 'flex';
	form.style.flexDirection = 'column';
	form.style.alignItems = 'center';

	const codeInput = document.createElement('input');
	codeInput.type = 'text';
	codeInput.maxLength = 6;
	codeInput.pattern = '\\d{6}';
	codeInput.autocomplete = 'one-time-code';
	codeInput.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	codeInput.style.textAlign = 'center';
	codeInput.style.margin = '10px 0';
	codeInput.style.borderRadius = '5px';
	codeInput.style.background = '#363430';
	codeInput.style.border = 'none';
	codeInput.style.color = 'white';
	codeInput.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	form.appendChild(codeInput);

	const submitBtn = document.createElement('button');
	submitBtn.type = 'submit';
	submitBtn.textContent = 'Disable 2FA';
	submitBtn.style.border = 'none';
	submitBtn.style.borderRadius = '5px';
	submitBtn.style.textAlign = 'center';
	submitBtn.style.fontFamily = '"RobotoCondensed", sans-serif';
	submitBtn.style.color = 'white';
	submitBtn.style.background = '#363430';
	submitBtn.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	submitBtn.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	form.appendChild(submitBtn);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const code = codeInput.value.trim();
		if (!/^\d{6}$/.test(code)) {
			customAlert('Please enter a valid 6-digit code.'); //needed customAlert
			return;
		}
		try {
			const res = await fetch('/api/2fa/disable', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ playerNr, token: code }),
				credentials: 'include'
			});
			const data = await res.json();
			if (data.success) {
				label.textContent = '2FA disabled successfully!';
				form.remove();
				if (data.playerNr == 1)
					UI.user1.Twofa = false; //changed this line with the new main
				else
					UI.user2.Twofa = false; //changed this line with the new main
				setTimeout(() => overlay.remove(), 1000);
				document.getElementById('menu')?.remove();
			} else {
				customAlert('Failed to disable 2FA.'); //needed customAlert
			}
		} catch (err) {
			customAlert('Error disabling 2FA.'); ////needed customAlert
		}
	});

	formDiv.appendChild(form);
	overlay.appendChild(formDiv);
	const body = document.getElementById('body');
	body?.appendChild(overlay);
	});
	return twofaDisableBtn;
}

function get2faSetupBtn(playerNr: number): HTMLButtonElement {
	const twoFABtn = document.createElement('button');
	twoFABtn.textContent = 'Set Up 2FA';
	twoFABtn.addEventListener('click', async () => {
	console.log('2FA button clicked for player ' + playerNr);

	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.background = 'rgba(0,0,0,0.25)';
	overlay.style.display = 'flex';
	overlay.style.flexDirection = 'column';
	overlay.style.justifyContent = 'center';
	overlay.style.alignItems = 'center';
	overlay.style.zIndex = '1000';
	overlay.addEventListener('click', () => overlay.remove());

	const qrDiv = document.createElement('div');
	qrDiv.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	qrDiv.style.padding = '20px';
	qrDiv.style.border = '12px solid black';
	qrDiv.style.borderRadius = '10px';
	qrDiv.style.display = 'flex';
	qrDiv.style.flexDirection = 'column';
	qrDiv.style.alignItems = 'center';
	qrDiv.style.position = 'relative';
	qrDiv.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	qrDiv.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'X';
	closeBtn.style.position = 'absolute';
	closeBtn.style.fontFamily = '"Horizon", sans-serif';
	closeBtn.style.top = '0px';
	closeBtn.style.right = '0px';
	closeBtn.style.fontSize = 'clamp(15px, 1.5vw, 20px)';
	closeBtn.style.background = 'transparent';
	closeBtn.style.border = 'none';
	closeBtn.style.color = 'black';
	closeBtn.style.cursor = 'pointer';
	closeBtn.addEventListener('click', () => overlay.remove());
	qrDiv.appendChild(closeBtn);
	
	const qrLabel = document.createElement('div');
	qrLabel.textContent = 'Scan this QR code with your Authenticator app:';
	qrLabel.style.fontFamily = '"RobotoCondensed", sans-serif';
	qrLabel.style.marginBottom = '10px';
	qrDiv.appendChild(qrLabel);

	const qrImg = document.createElement('img');
	qrImg.style.width = '300px';
	qrImg.style.aspectRatio = '1/1';
	qrImg.style.background = 'transparent';
	qrImg.style.mixBlendMode = 'multiply';
	qrDiv.appendChild(qrImg);

	try {
		const res = await fetch('/api/2fa/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playerNr })
		});
		const data = await res.json();
		if (data.success === false) {
			customAlert(data.message || 'Failed to generate QR code.'); //needed customAlert
			return;
		} else if (data.qrCodeDataURL) {
			qrImg.src = data.qrCodeDataURL;
		} else {
			qrLabel.textContent = 'Failed to load QR code.';
		}
	} catch (err) {
		qrLabel.textContent = 'Error loading QR code.';
	}

	const form = document.createElement('form');
	form.style.display = 'flex';
	form.style.flexDirection = 'column';
	form.style.alignItems = 'center';

	const codeLabel = document.createElement('label');
	codeLabel.textContent = 'Enter 6-digit code:';
	codeLabel.style.fontFamily = '"RobotoCondensed", sans-serif';
	codeLabel.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	codeLabel.htmlFor = 'twofaCodeInput';
	form.appendChild(codeLabel);

	const codeInput = document.createElement('input');
	codeInput.type = 'text';
	codeInput.style.border = 'none';
	codeInput.style.borderRadius = '5px';
	codeInput.style.background = '#363430';
	codeInput.id = 'twofaCodeInput';
	codeInput.maxLength = 6;
	codeInput.pattern = '\\d{6}';
	codeInput.autocomplete = 'one-time-code';
	codeInput.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	codeInput.style.textAlign = 'center';
	codeInput.style.margin = '10px 0';
	codeInput.style.color = 'white';
	codeInput.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	form.appendChild(codeInput);

	const submitBtn = document.createElement('button');
	submitBtn.type = 'submit';
	submitBtn.textContent = 'Activate 2FA';
	submitBtn.style.border = 'none';
	submitBtn.style.borderRadius = '5px';
	submitBtn.style.textAlign = 'center';
	submitBtn.style.fontFamily = '"RobotoCondensed", sans-serif';
	submitBtn.style.color = 'white';
	submitBtn.style.background = '#363430';
	submitBtn.style.fontSize = 'clamp(15px, 1.7vw, 18px)';
	submitBtn.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 10px 25px';
	form.appendChild(submitBtn);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const code = codeInput.value.trim();
		if (!/^\d{6}$/.test(code)) {
			customAlert('Please enter a valid 6-digit code.'); //needed customAlert
			return;
		}
		try {
			const res = await fetch('/api/2fa/activate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: code })
			});
			const data = await res.json();
			if (data.success) {
				qrImg.remove();
				qrLabel.textContent = '2FA activated successfully!';
				form.remove();
				UI.user1.Twofa = playerNr === 1 ? true : UI.user1.Twofa;
				setTimeout(() => {
					overlay.remove();
				}, 1000); // 1000 ms = 1 second
				document.getElementById('menu')?.remove();
				// Optionally update UI or state here
			} else {
				customAlert(data.message || '2FA verification failed.'); //needed customAlert
			}
		} catch (err) {
			customAlert('Error verifying 2FA.'); //needed customAlert
		}
	});

	qrDiv.appendChild(form);
	overlay.appendChild(qrDiv);
	const body = document.getElementById('body')
	body?.appendChild(overlay);
	});
	return (twoFABtn);
}

export function get2faBtn(playerNr: number): HTMLButtonElement {
	if (UI.user1.Twofa && playerNr == 1)
		return (get2faDisableBtn(playerNr));
	if (UI.user2.Twofa && playerNr == 2)
		return (get2faDisableBtn(playerNr));
	return (get2faSetupBtn(playerNr));
}

export function getAvatarBtn(playerNr: number): HTMLButtonElement {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = 'image/*';
	fileInput.style.display = 'none';

	fileInput.addEventListener('change', () => {
		const file = fileInput.files?.[0];
		if (file)
			changeAvatar(file, playerNr);
	});

	const button = document.createElement('button');
	button.textContent = 'Change Avatar';

	button.addEventListener('click', () => {
		fileInput.click();
	});
	button.appendChild(fileInput);
	return button;
}

export function getProfileSettingsBtn(): HTMLButtonElement {
	const button = document.createElement('button');
	button.textContent = 'Profile Settings';
	button.addEventListener('click', (e) => { 
		const newName = getProfileSettings(e)
	
	});
	return button;
}

function getLogoutBtn(playerNr: number): HTMLButtonElement {
	const logoutBtn = document.createElement('button');
	logoutBtn.textContent = 'Logout';
	logoutBtn.id = `LogoutBtn${playerNr}`;
	logoutBtn.addEventListener('click', (e) => submitLogout(e, playerNr));
	return (logoutBtn);
}

export function getLoginBtn(playerNr: number): HTMLButtonElement {
	if (playerNr == 1 || UI.user2.ID != 1)
		return (getLogoutBtn(playerNr));
	const loginBtn = document.createElement('button');
	loginBtn.textContent = 'Login';
	loginBtn.addEventListener('click', () => {
		console.log('Login button clicked for player ' + playerNr);
		document.getElementById('menu')?.remove();
		if (playerNr == 2) {
			navigateTo('LoginP2');
		} else {
			navigateTo('LoginP1');
		}
	});
	return (loginBtn);
}
