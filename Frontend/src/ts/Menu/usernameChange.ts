import { Game, UI } from "../gameData.js";
import { customAlert } from '../Alerts/customAlert.js';


function styleChangeUsernameTitle(): HTMLDivElement {
	const title = document.createElement('div');
	title.textContent = 'Change Username';
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.color = 'black';
	title.style.fontSize = 'clamp(20px, 4vw, 30px)';
	title.style.display = 'flex';
	title.style.justifyContent = 'center';
	title.style.alignItems = 'center';
	title.style.textAlign = 'center';
	title.style.padding = '5px';
	title.style.margin = '10px';
	return title;
}

function styleSubmitBtn(): HTMLButtonElement {
	const button = document.createElement('button');
	button.textContent = 'Change';
	button.style.width = '100%';
	button.style.height = '20%'
	button.style.borderRadius = '5px';
	button.style.display = 'flex';
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.background = '#363430';
	button.style.color = 'white';
	button.style.border = 'none';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	button.style.borderRadius = '5px';
	button.style.justifyContent = 'center';
	button.style.alignItems = 'center';
	return button
}

function getChangeName(): HTMLDivElement {
	const cnDiv = document.createElement('div');
	cnDiv.id = 'changeName';
	cnDiv.style.width = '100%';
	cnDiv.style.height = '100%';
	cnDiv.style.margin = '0';
	cnDiv.style.top = '0';
	cnDiv.style.left = '0';
	cnDiv.style.display = 'flex';
	cnDiv.style.flexDirection = 'column',
		cnDiv.style.justifyContent = 'center';
	cnDiv.style.alignItems = 'center';
	cnDiv.style.backdropFilter = 'blur(6px)';
	cnDiv.style.backgroundColor = 'rgb(54, 52, 48);';
	cnDiv.style.position = 'fixed';
	cnDiv.style.zIndex = '100';
	cnDiv.style.padding = '5px';
	return (cnDiv);
}

function getExitBtn(cnDiv: HTMLDivElement): HTMLButtonElement {
	const exitButton = document.createElement('button');
	exitButton.id = 'exitButton';
	exitButton.textContent = 'X';
	exitButton.style.color = 'black';
	exitButton.style.fontSize = 'clamp(10px, 1.5vw, 15px)';
	exitButton.style.position = 'flex';
	exitButton.style.background = 'transparent'
	exitButton.style.border = 'transparent';
	exitButton.style.fontSize = 'clamp(10px, 2vw, 30px)';
	exitButton.style.fontFamily = '"Horizon", sans-serif';
	exitButton.style.justifyContent = 'center';
	exitButton.style.alignItems = 'center';

	exitButton.addEventListener('click', () => {
		cnDiv.remove();
	});
	return (exitButton);
}

function getTitleAndExitBtn(cnDiv: HTMLDivElement): HTMLDivElement {
	const exitBtn = getExitBtn(cnDiv);
	const cnName = styleChangeUsernameTitle();
	const divElementBlock = document.createElement('div');
	divElementBlock.style.borderRadius = '5px';
	divElementBlock.style.color = 'black';
	divElementBlock.style.gap = '2.5rem';
	divElementBlock.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	divElementBlock.style.alignItems = 'center';
	divElementBlock.style.justifyContent = 'center';
	divElementBlock.style.flex = '1 1';
	divElementBlock.style.display = 'flex';
	divElementBlock.style.flexDirection = 'row';
	divElementBlock.style.height = '60%';
	divElementBlock.append(cnName, exitBtn);
	return (divElementBlock);
}

function getBlackContainerBlock(): HTMLDivElement {
	const blackContainer = document.createElement('div');
	blackContainer.style.aspectRatio = '3 / 2';
	blackContainer.style.width = 'clamp(350px, 40vh, 500px)';
	blackContainer.style.borderRadius = '10px';
	blackContainer.style.padding = '0.7rem';
	blackContainer.style.background = 'black';
	blackContainer.style.justifyContent = 'center';
	blackContainer.style.gap = '0.7rem';
	blackContainer.style.display = 'flex';
	blackContainer.style.flexDirection = 'column';
	blackContainer.style.borderRadius = '10px';
	blackContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
	return (blackContainer);
}

export function getChangeNameField(e: Event | null, playerNr: number) {
	const cnDiv = getChangeName();
	const titleAndExitBtn = getTitleAndExitBtn(cnDiv);

	const input = document.createElement('input');
	input.type = "text";
	input.placeholder = "New Username";
	input.id = `usernameInput${playerNr}`;
	input.style.justifyContent = 'center';
	input.style.alignItems = 'center';
	input.style.height = '20%'

	const submitBtn = styleSubmitBtn();
	submitBtn.addEventListener("click", () => {
		const newUsername = input.value.trim();
		if (!newUsername) {
			customAlert("Please enter a username!"); //needed customAlert
			return;
		}
		Game.socket.emit('message', {
			action: 'playerInfo',
			subaction: 'changeName',
			user_id: UI.user1.ID,
			oldName: UI.user1.name,
			name: newUsername
		})
		document.getElementById('changeName')?.remove();
	});
	const blackContainer = getBlackContainerBlock();
	blackContainer.append(titleAndExitBtn, input, submitBtn);
	cnDiv.appendChild(blackContainer);
	document.body.append(cnDiv);
}