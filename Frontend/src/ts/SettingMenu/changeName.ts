import { Game, UI } from "../gameData.js";

export function getChangeNameField(e: Event | null, playerNr: number) {
	const cnDiv = document.createElement('div');
	cnDiv.id = 'changeName';
	cnDiv.style.position = 'absolute';
	cnDiv.style.width = '30vw';
	cnDiv.style.height = '30vh';
	cnDiv.style.background = 'white';
	cnDiv.style.flexDirection = 'column';
	cnDiv.style.justifyContent = 'space-between';

	  const input = document.createElement('input');
 	input.type = "text";
 	input.placeholder = "New Username";
 	input.id = `usernameInput${playerNr}`;

	const submitBtn = document.createElement('button');
	submitBtn.className = "submitButton";
	submitBtn.textContent = 'Change';

	submitBtn.addEventListener("click", () => {
		const newUsername = input.value.trim();

		if (!newUsername) {
			alert("Please enter a username!");
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

	cnDiv.append(input, submitBtn);
	document.body.append(cnDiv);
}

// FOR MENU
// function getChangeNameBtn(playerNr: number): HTMLButtonElement {
// 	const changeNameBtn = document.createElement('button');
// 	changeNameBtn.textContent = 'change Username';
// 	changeNameBtn.style.backgroundColor = '#d9f0ff';
// 	changeNameBtn.style.border = '2px solid #d9f0ff';
// 	changeNameBtn.style.padding = '15px';
// 	changeNameBtn.style.fontSize = '1em';
// 	changeNameBtn.style.cursor = 'pointer';
// 	changeNameBtn.style.borderRadius = '10px';
// 	changeNameBtn.style.marginLeft = 'auto';
// 	changeNameBtn.style.marginBottom = '10px';
// 	changeNameBtn.style.fontFamily = 'inherit';
// 	changeNameBtn.addEventListener('click', (e) => getChangeNameField(e, playerNr));
// 	return (changeNameBtn);
// }