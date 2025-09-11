import { changeOpponentType, changeMatchFormat, startGame } from "../Game/initGame.js";
import { navigateTo } from "../history.js";
import { UI } from "../gameData.js";

function styleSettingTitle(text: string): HTMLDivElement {
	const title = document.createElement('div');
	title.textContent = text;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.color = 'black';
	title.style.fontSize = 'clamp(20px, 5vw, 50px)';
	title.style.display = 'flex';
	title.style.justifyContent = 'center';
	title.style.alignItems = 'center';
	// title.style.whiteSpace = 'nowrap';
	title.style.textAlign = 'center';

	return title;
}

function styleSettingsBttns(text: string, opponent_type: string): HTMLButtonElement {
	const button = document.createElement('button');
	button.style.display = 'flex';
	button.textContent = text;
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.background = '#363430';
	button.style.color = 'white';
	button.style.border = 'none';
	button.style.flex = '1';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	button.style.fontSize = 'clamp(10px, 1.5vw, 18px)';
	button.style.borderRadius = '5px';
	button.style.justifyContent = 'center';
	button.style.alignItems = 'center';
	// button.style.height = '10%';

	button.addEventListener("click", () => {
		const container = button.parentElement;
		if (!container)
			return;
		container.querySelectorAll("button").forEach((btn) => {
			(btn as HTMLButtonElement).style.background = '#363430';
			(btn as HTMLButtonElement).style.color = 'white';
		});
		button.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
		button.style.color = 'black';
		button.dataset.active = 'true';
		changeOpponentType(opponent_type);
	})
	return button
}

function styleContainerButtons(): HTMLDivElement {
	const buttonContainer = document.createElement('div');
	buttonContainer.style.width = '85%';
	buttonContainer.style.alignItems = 'center';
	buttonContainer.style.justifyContent = 'space-around';
	// buttonContainer.style.flex = '1';
	buttonContainer.style.display = 'flex';
	buttonContainer.style.gap = '0.5rem';
	buttonContainer.style.height = '10%';
	return buttonContainer;
}

function stylePlayGameBttn(text: string): HTMLButtonElement {
	const button = document.createElement('button');
	button.style.width = '85%';
	button.style.height = '10%'
	button.style.borderRadius = '5px';
	button.style.display = 'flex';
	button.textContent = text;
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.background = '#363430';
	button.style.color = 'white';
	button.style.border = 'none';
	// button.style.flex = '1';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	button.style.fontSize = 'clamp(10px, 2.5vw, 22px)';
	button.style.borderRadius = '5px';
	button.style.justifyContent = 'center';
	button.style.alignItems = 'center';
	// if (match_type == 'play game') {
	// button.addEventListener('click', () => startGame());
	return button;
	// }
	// button.addEventListener("click", () => {
	// 	const container = button.parentElement;
	// 	if (!container)
	// 		return;
	// 	container.querySelectorAll("button").forEach((btn) => {
	// 		(btn as HTMLButtonElement).style.background = '#363430';
	// 		(btn as HTMLButtonElement).style.color = 'white';
	// 	});
	// 	button.style.background = '#0000003d';
	// 	button.dataset.active = 'true';
	// 	changeMatchFormat(match_type);
	// });
	// return button;
}

export function getOpponentMenu() {
	const body = document.getElementById('body');
	if (!body)
		return ;

	const opponentMenu = document.createElement('div');
	opponentMenu.id = 'opponentMenu';
	opponentMenu.style.width = '100%';
	opponentMenu.style.height = '100%';
	opponentMenu.style.margin = '0';
	opponentMenu.style.top = '0';
	opponentMenu.style.left = '0';
	opponentMenu.style.display = 'flex';
	opponentMenu.style.justifyContent = 'center';
	opponentMenu.style.alignItems = 'center';
	opponentMenu.style.backdropFilter = 'blur(6px)';
	opponentMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.25)'; 
	opponentMenu.style.position = 'fixed';
	opponentMenu.style.zIndex = '100';

	opponentMenu.addEventListener('click', (e) => {
		changeOpponentType('empty');
		changeMatchFormat('empty');
		if (e.target === opponentMenu) {
			navigateTo('Menu');
		}
	});

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
	blackContainer.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	const gameModeContainer = document.createElement('div');
	gameModeContainer.id = 'settingContainer';
	gameModeContainer.style.borderRadius = '5px';
	gameModeContainer.style.color = 'black';
	gameModeContainer.style.gap = '2.5rem';
	gameModeContainer.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	gameModeContainer.style.alignItems = 'center';
	gameModeContainer.style.justifyContent = 'center';
	gameModeContainer.style.flex = '1 1';
	gameModeContainer.style.display = 'flex';
	gameModeContainer.style.flexDirection = 'column';

	const gameModeTitle = styleSettingTitle('Choose Opponent');

	const gameModeButtonsContainer = styleContainerButtons();
	gameModeButtonsContainer.appendChild(styleSettingsBttns('vs AI', '1 vs COM'));
	gameModeButtonsContainer.appendChild(styleSettingsBttns(`vs ${UI.user2.name}`, '1 vs 1'));
	gameModeButtonsContainer.appendChild(styleSettingsBttns('vs Online', 'Online'));

	const playGameButton = stylePlayGameBttn('Play Game');
	playGameButton.style.width = '85%';
	playGameButton.addEventListener('click', () => {
		changeMatchFormat('single game');
		startGame();
	});

	gameModeContainer.appendChild(gameModeTitle);
	gameModeContainer.appendChild(gameModeButtonsContainer);
	gameModeContainer.appendChild(playGameButton);

	blackContainer.appendChild(gameModeContainer);

	opponentMenu.appendChild(blackContainer);
	body.append(opponentMenu);
}