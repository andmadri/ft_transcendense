// import * as S from '../structs.js';
// import { log } from '../logging.js';
// import { loginSuccessfull } from './userAuth.js';


// function submitTwoFactorForm(e: Event, playerNr: number) {
// 	e.preventDefault();
// 	const form = e.target as HTMLFormElement;
// 	const twofaCode = (form.querySelector<HTMLInputElement>(`#twofaCode${playerNr}`)?.value ?? '').trim();

// 	if (!twofaCode) {
// 		alert("Please enter the 2FA code");
// 		return;
// 	}

// 	log(`Submitting 2FA code for playerNr ${playerNr}`);
// 	const payload = { playerNr: playerNr, twofaCode };

// 	fetch(`https://${S.host}:8443/api/verify`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify(payload),
// 	})
// 		.then(response => {
// 			if (!response.ok) {
// 				throw new Error('Network response was not ok');
// 			}
// 			return response.json();
// 		})
// 		.then(data => {
// 			log(`2FA verification successful for playerNr ${playerNr}: ${data.message}`);
// 			loginSuccessfull(playerNr, data.userId, data.name);
// 		})
// 		.catch(error => {
// 			log(`2FA verification failed for playerNr ${playerNr}: ${error.message}`);
// 			alert("2FA verification failed. Please try again.");
// 		});
// }

// export function getTwoFactorFields(playerNr: number) {
// 	const body = document.getElementById('body');
// 	if (!body) return;
// 	body.style.height = "100vh";
// 	body.style.backgroundColor = "#ededeb";
// 	body.style.justifyContent = "center";

// 	const twofaContainer = document.createElement('div');
// 	twofaContainer.className = 'twofaContainer';
// 	twofaContainer.id = 'twofa' + playerNr;

// 	twofaContainer.innerHTML = `
// 		<form class="twofaForm" id="twofaForm${playerNr}">
// 			<div class="header">
// 				<div class="header1Text">Two-Factor Authentication</div>
// 			</div>
// 			<div class="inputSingle">
// 				<label for="twofaCode${playerNr}">Enter 2FA Code</label>
// 				<div class="inputWithIcon">
// 					<input type="text" id="twofaCode${playerNr}" name="twofaCode" maxlength="6" autocomplete="one-time-code" />
// 				</div>
// 			</div>
// 			<div class="inputButtons">
// 				<button type="submit" class="submitButton">Verify</button>
// 			</div>
// 		</form>
// 	`;

// 	body.appendChild(twofaContainer);

// 	document.getElementById('twofaForm' + playerNr)?.addEventListener('submit', (e) => {
// 		e.preventDefault();
// 		submitTwoFactorForm(e, playerNr)
// 		log('2FA form submitted for playerNr ' + playerNr);
// 	});
// }


