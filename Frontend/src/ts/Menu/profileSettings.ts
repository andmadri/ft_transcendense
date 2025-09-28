import { Game, UI } from "../gameData.js";
import { customAlert } from '../Alerts/customAlert.js';

function styleChangeUsernameTitle(): HTMLDivElement {
	const title = document.createElement('div');
	title.textContent = "Profile Settings";
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
	button.textContent = "Change";
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

function getChangeDiv(id: string): HTMLDivElement {
	const cnDiv = document.createElement('div');
	cnDiv.id = id;
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

function getInputField(txt: string): HTMLInputElement {
	const input = document.createElement('input');
	if (txt == "password")
		input.type = "password"
	else
 		input.type = "text";
 	input.placeholder = "New " + txt;
 	input.id = `${txt}Input`;
	input.style.justifyContent = 'center';
	input.style.alignItems = 'center';
	input.style.height = '50%'
	return (input);
}

let firstPassword = "";

function getSubMitBtn(txt: string, input: HTMLInputElement): HTMLButtonElement{
	const submitBtn = styleSubmitBtn();
	submitBtn.addEventListener("click", () => {
		const newInput = input.value.trim();
		if (!newInput) {
			return;
		}
		if (txt == 'password') {
			if (firstPassword == "") {
				submitBtn.textContent = " Again!";
				firstPassword = newInput;
				input.value = "";
				return;
			} else {
				if (firstPassword != newInput) {
					customAlert('Passwords are not the same');
					input.value = "";
					firstPassword = "";
					submitBtn.textContent = 'Change';
					return;
				}
				firstPassword = "";
				submitBtn.textContent = 'Change';
			}
		}
		Game.socket.emit('message', {
			action: 'playerInfo',
			subaction: 'profileSettings',
			user_id: UI.user1.ID,
			field: txt,
			new: newInput
		})
		input.value = "";
	});
	return (submitBtn);
}

function getInputRow(field: string): HTMLDivElement {
	const row = document.createElement("div");
	row.style.display = "flex";
	row.style.flexDirection = "row";
	row.style.alignItems = "center";
	row.style.justifyContent = "space-between";
	row.style.gap = "0.5rem";
	row.style.width = "100%";

	const input = getInputField(field);
	input.style.flex = "1";
	input.style.padding = "0.3rem";

	const submitBtn = getSubMitBtn(field, input);
	submitBtn.style.flex = "0"; 
	submitBtn.style.width = "30%"; 

	row.append(input, submitBtn);
	return row;
}

export function getProfileSettings(e: Event | null) {
	const allInfo = getChangeDiv("Profile Settings");
	const titleAndExitBtn = getTitleAndExitBtn(allInfo);

	let information = [];
	if (UI.user1.Google == false)
		information = ["name", "password", "email"];
	else
		information = ["name"];

	const blackContainer = getBlackContainerBlock();
	blackContainer.append(titleAndExitBtn);
	for(const field of information) {
		const row = getInputRow(field);
		blackContainer.append(row);
	}
	allInfo.appendChild(blackContainer);
	document.body.append(allInfo);
}
