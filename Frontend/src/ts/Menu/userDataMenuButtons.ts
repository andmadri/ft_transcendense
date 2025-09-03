import { Game } from "../gameData";
import { navigateTo } from "../history";
import { submitLogout } from "../Auth/logout";
import { changeAvatar } from "./avatar";

function get2faDisableBtn(playerNr: number): HTMLButtonElement {
	const twofaDisableBtn = document.createElement('button');
	twofaDisableBtn.textContent = 'Disable 2FA';
	// styleElement(twofaDisableBtn, {
	// 	backgroundColor: '#d9f0ff',
	// 	border: '2px solid #d9f0ff',
	// 	padding: '15px',
	// 	fontSize: '1em',
	// 	cursor: 'pointer',
	// 	borderRadius: '10px',
	// 	marginLeft: 'auto',
	// 	marginBottom: '10px',
	// 	fontFamily: 'inherit'
	// });
	twofaDisableBtn.addEventListener('click', async () => {
		console.log('2FA Disable button clicked for player ' + playerNr);

		// Overlay
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.background = 'rgba(0,0,0,0.7)';
		overlay.style.display = 'flex';
		overlay.style.flexDirection = 'column';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';
		overlay.style.zIndex = '1000';

		const closeBtn = document.createElement('button');
		closeBtn.textContent = 'X';
		closeBtn.style.position = 'absolute';
		closeBtn.style.top = '30px';
		closeBtn.style.right = '30px';
		closeBtn.style.fontSize = '2em';
		closeBtn.style.background = 'transparent';
		closeBtn.style.border = 'none';
		closeBtn.style.color = 'white';
		closeBtn.style.cursor = 'pointer';
		closeBtn.addEventListener('click', () => overlay.remove());
		overlay.appendChild(closeBtn);

		const formDiv = document.createElement('div');
		formDiv.style.background = 'white';
		formDiv.style.padding = '30px';
		formDiv.style.borderRadius = '10px';
		formDiv.style.display = 'flex';
		formDiv.style.flexDirection = 'column';
		formDiv.style.alignItems = 'center';

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
		codeInput.style.fontSize = '1.5em';
		codeInput.style.textAlign = 'center';
		codeInput.style.margin = '10px 0';
		form.appendChild(codeInput);

		const submitBtn = document.createElement('button');
		submitBtn.type = 'submit';
		submitBtn.textContent = 'Disable 2FA';
		submitBtn.style.fontSize = '1em';
		form.appendChild(submitBtn);

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const code = codeInput.value.trim();
			if (!/^\d{6}$/.test(code)) {
				alert('Please enter a valid 6-digit code.');
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
						Game.match.player1.Twofa = false;
					else
						Game.match.player2.Twofa = false;
					setTimeout(() => overlay.remove(), 1000);
					document.getElementById('menu')?.remove();
				} else {
					alert(data.message || 'Failed to disable 2FA.');
				}
			} catch (err) {
				alert('Error disabling 2FA.');
			}
		});

		formDiv.appendChild(form);
		overlay.appendChild(formDiv);
		const app = document.getElementById('app');
		app?.appendChild(overlay);
	});
	return twofaDisableBtn;
}

function get2faSetupBtn(playerNr: number): HTMLButtonElement {
	const twoFABtn = document.createElement('button');
	twoFABtn.textContent = 'Set Up 2FA';
	// styleElement(twoFABtn, {
	// 	backgroundColor: '#d9f0ff',
	// 	border: '2px solid #d9f0ff',
	// 	padding: '15px',
	// 	fontSize: '1em',
	// 	cursor: 'pointer',
	// 	borderRadius: '10px',
	// 	marginLeft: 'auto',
	// 	marginBottom: '10px',
	// 	fontFamily: 'inherit'
	// });
	twoFABtn.addEventListener('click', async () => {
		console.log('2FA button clicked for player ' + playerNr);

		// Create overlay
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.background = 'rgba(0,0,0,0.7)';
		overlay.style.display = 'flex';
		overlay.style.flexDirection = 'column';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';
		overlay.style.zIndex = '1000';

		const closeBtn = document.createElement('button');
		closeBtn.textContent = 'X';
		closeBtn.style.position = 'absolute';
		closeBtn.style.top = '30px';
		closeBtn.style.right = '30px';
		closeBtn.style.fontSize = '2em';
		closeBtn.style.background = 'transparent';
		closeBtn.style.border = 'none';
		closeBtn.style.color = 'white';
		closeBtn.style.cursor = 'pointer';
		closeBtn.addEventListener('click', () => overlay.remove());
		overlay.appendChild(closeBtn);

		const qrDiv = document.createElement('div');
		qrDiv.style.background = 'white';
		qrDiv.style.padding = '30px';
		qrDiv.style.borderRadius = '10px';
		qrDiv.style.display = 'flex';
		qrDiv.style.flexDirection = 'column';
		qrDiv.style.alignItems = 'center';

		const qrLabel = document.createElement('div');
		qrLabel.textContent = 'Scan this QR code with your Authenticator app:';
		qrLabel.style.marginBottom = '10px';
		qrDiv.appendChild(qrLabel);

		const qrImg = document.createElement('img');
		qrImg.style.width = '200px';
		qrImg.style.height = '200px';
		qrImg.style.marginBottom = '20px';
		qrDiv.appendChild(qrImg);

		// Fetch QR code from backend
		try {
			const res = await fetch('/api/2fa/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ playerNr })
			});
			const data = await res.json();
			if (data.success === false) {
				alert(data.message || 'Failed to generate QR code.');
				return;
			} else if (data.qrCodeDataURL) {
				qrImg.src = data.qrCodeDataURL;
			} else {
				qrLabel.textContent = 'Failed to load QR code.';
			}
		} catch (err) {
			qrLabel.textContent = 'Error loading QR code.';
		}

		// 2FA code input form
		const form = document.createElement('form');
		form.style.display = 'flex';
		form.style.flexDirection = 'column';
		form.style.alignItems = 'center';
		form.style.marginTop = '10px';

		const codeLabel = document.createElement('label');
		codeLabel.textContent = 'Enter 6-digit code:';
		codeLabel.htmlFor = 'twofaCodeInput';
		form.appendChild(codeLabel);

		const codeInput = document.createElement('input');
		codeInput.type = 'text';
		codeInput.id = 'twofaCodeInput';
		codeInput.maxLength = 6;
		codeInput.pattern = '\\d{6}';
		codeInput.autocomplete = 'one-time-code';
		codeInput.style.fontSize = '1.5em';
		codeInput.style.textAlign = 'center';
		codeInput.style.margin = '10px 0';
		form.appendChild(codeInput);

		const submitBtn = document.createElement('button');
		submitBtn.type = 'submit';
		submitBtn.textContent = 'activate 2FA';
		submitBtn.style.fontSize = '1em';
		form.appendChild(submitBtn);

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const code = codeInput.value.trim();
			if (!/^\d{6}$/.test(code)) {
				alert('Please enter a valid 6-digit code.');
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
					Game.match.player1.Twofa = playerNr === 1 ? true : Game.match.player1.Twofa;
					setTimeout(() => {
						overlay.remove();
					}, 1000); // 1000 ms = 1 second
					document.getElementById('menu')?.remove();
					// Optionally update UI or state here
				} else {
					alert(data.message || '2FA verification failed.');
				}
			} catch (err) {
				alert('Error verifying 2FA.');
			}
		});

		qrDiv.appendChild(form);
		overlay.appendChild(qrDiv);
		const app = document.getElementById('app')
		app?.appendChild(overlay);
	});
	return (twoFABtn);
}

export function get2faBtn(playerNr: number): HTMLButtonElement {
	if (Game.match.player1.Twofa && playerNr == 1)
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



function getLogoutBtn(playerNr: number): HTMLButtonElement {
	const logoutBtn = document.createElement('button');
	logoutBtn.textContent = 'Logout';
	// styleElement(logoutBtn, {
	// 	backgroundColor: '#d9f0ff',
	// 	border: '2px solid #d9f0ff',
	// 	padding: '15px',
	// 	fontSize: '1em',
	// 	cursor: 'pointer',
	// 	borderRadius: '10px',
	// 	marginLeft: 'auto',
	// 	marginBottom: '10px',
	// 	fontFamily: 'inherit'
	// });
	logoutBtn.addEventListener('click', (e) => submitLogout(e, playerNr));
	return (logoutBtn);
}

export function getLoginBtn(playerNr: number): HTMLButtonElement {
	if (playerNr == 1 || Game.match.player2.ID != 1)
		return (getLogoutBtn(playerNr));
	const loginBtn = document.createElement('button');
	loginBtn.textContent = 'Login';
	// styleElement(loginBtn, {
	// 	backgroundColor: '#d9f0ff',
	// 	border: '2px solid #d9f0ff',
	// 	padding: '15px',
	// 	fontSize: '1em',
	// 	cursor: 'pointer',
	// 	borderRadius: '10px',
	// 	marginLeft: 'auto',
	// 	marginBottom: '10px',
	// 	fontFamily: 'inherit'
	// });
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
