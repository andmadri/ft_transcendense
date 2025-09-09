import { changeOpponentType, changeMatchFormat, startGame } from "../Game/initGame.js";
import { navigateTo } from "../history.js";

function styleSettingTitle(text: string): HTMLDivElement {
	const title = document.createElement('div');
	title.textContent = text;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.color = 'black';
	title.style.fontSize = 'clamp(20px, 2.5vw, 40px)';
	title.style.display = 'flex';
	title.style.justifyContent = 'center';
	title.style.alignItems = 'center';
	title.style.whiteSpace = 'nowrap';
	// title.style.marginTop = '1rem';

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
	buttonContainer.style.width = '70%';
	buttonContainer.style.alignItems = 'center';
	buttonContainer.style.justifyContent = 'space-around';
	// buttonContainer.style.flex = '1';
	buttonContainer.style.display = 'flex';
	buttonContainer.style.gap = '0.5rem';
	return buttonContainer;
}

function styleGameModeBttns(text: string, match_type: string): HTMLButtonElement {
	const button = document.createElement('button');
	button.style.borderRadius = '5px';
	button.style.display = 'flex';
	button.textContent = text;
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.background = '#363430';
	button.style.color = 'white';
	button.style.border = 'none';
	// button.style.flex = '1';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	button.style.fontSize = 'clamp(10px, 1.5vw, 18px)';
	button.style.borderRadius = '5px';
	button.style.justifyContent = 'center';
	if (match_type == 'play game') {
		button.addEventListener('click', () => startGame());
		return button;
	}
	button.addEventListener("click", () => {
		const container = button.parentElement;
		if (!container)
			return;
		container.querySelectorAll("button").forEach((btn) => {
			(btn as HTMLButtonElement).style.background = '#363430';
			(btn as HTMLButtonElement).style.color = 'white';
		});
		button.style.background = '#0000003d';
		button.dataset.active = 'true';
		changeMatchFormat(match_type);
	});
	return button;
}

export function getSettingsPage() {
	const body = document.getElementById('body');
	if (!body)
		return ;

	const settingPage = document.createElement('div');
	settingPage.id = 'settingPage';
	settingPage.style.width = '100%';
	settingPage.style.height = '100%';
	settingPage.style.margin = '0';
	settingPage.style.top = '0';
	settingPage.style.left = '0';
	settingPage.style.display = 'flex';
	settingPage.style.justifyContent = 'center';
	settingPage.style.alignItems = 'center';
	settingPage.style.backdropFilter = 'blur(6px)';
	settingPage.style.backgroundColor = 'rgba(0, 0, 0, 0.25)'; 
	settingPage.style.position = 'fixed';
	settingPage.style.zIndex = '100';

	settingPage.addEventListener('click', (e) => {
		changeOpponentType('empty');
		changeMatchFormat('empty');
		if (e.target === settingPage) {
			navigateTo('Menu');
		}
	});


	const blackContainer = document.createElement('div');
	blackContainer.style.aspectRatio = '3 / 2';
	blackContainer.style.width = 'clamp(350px, 50vh, 650px)';
	blackContainer.style.borderRadius = '10px';
	blackContainer.style.padding = '0.7rem';
	blackContainer.style.background = 'black';
	blackContainer.style.justifyContent = 'center';
	blackContainer.style.gap = '0.7rem';
	blackContainer.style.display = 'flex';
	blackContainer.style.flexDirection = 'column';
	blackContainer.style.borderRadius = '10px';
	//added a shadow let's see how this looks
	blackContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
	blackContainer.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	const settingContainer = document.createElement('div');
	settingContainer.id = 'settingContainer';
	settingContainer.style.borderRadius = '5px';
	settingContainer.style.color = 'black';
	settingContainer.style.gap = '0.7rem';
	settingContainer.style.background = 'white';
	settingContainer.style.justifyContent = 'center';
	settingContainer.style.alignItems = 'center';
	settingContainer.style.flex = '1 1';
	settingContainer.style.display = 'flex';
	settingContainer.style.flexDirection = 'column';



	const gameModeContainer = document.createElement('div');
	gameModeContainer.id = 'settingContainer';
	gameModeContainer.style.borderRadius = '5px';
	gameModeContainer.style.color = 'black';
	gameModeContainer.style.gap = '0.7rem';
	gameModeContainer.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	gameModeContainer.style.alignItems = 'center';
	gameModeContainer.style.justifyContent = 'center';
	gameModeContainer.style.flex = '1 1';
	gameModeContainer.style.display = 'flex';
	gameModeContainer.style.flexDirection = 'column';

	const settingTitle = styleSettingTitle('Settings');

	const settingEnemyText = document.createElement('div');
	settingEnemyText.textContent = 'Choose Opponent';
	settingEnemyText.style.textAlign = 'center';
	settingEnemyText.style.margin = '0.5rem';
	settingEnemyText.style.webkitTextStroke = '0.1rem #000000ff';
	settingEnemyText.style.color = 'transparent';
	settingEnemyText.style.fontFamily = '"Horizon", sans-serif';
	settingEnemyText.style.fontSize = 'clamp(15px, 2vw, 35px)';
	settingEnemyText.style.whiteSpace = 'nowrap';
	settingEnemyText.style.display = 'flex';
	settingEnemyText.style.alignItems = 'center';
	settingEnemyText.style.justifyContent = 'center';

	const settingButtonsContainer = styleContainerButtons();
	settingButtonsContainer.appendChild(styleSettingsBttns('vs AI', '1 vs COM'));
	settingButtonsContainer.appendChild(styleSettingsBttns('vs Guest', '1 vs 1'));
	settingButtonsContainer.appendChild(styleSettingsBttns('vs Online', 'Online'));


	const gameModeTitle = styleSettingTitle('Game Mode');
	const gameModeButtonsContainer = styleContainerButtons();
	gameModeButtonsContainer.appendChild(styleGameModeBttns('Single Player', 'single game'));
	gameModeButtonsContainer.appendChild(styleGameModeBttns('Tournament', 'tournament'));


	const playGameButton = styleGameModeBttns('Play Game', 'play game');
	playGameButton.style.width = '70%';
	playGameButton.addEventListener('click', () => startGame());

	settingContainer.appendChild(settingTitle);
	settingContainer.appendChild(settingEnemyText);
	settingContainer.appendChild(settingButtonsContainer);

	gameModeContainer.appendChild(gameModeTitle);
	gameModeContainer.appendChild(gameModeButtonsContainer);
	gameModeContainer.appendChild(playGameButton);

	blackContainer.appendChild(settingContainer);
	blackContainer.appendChild(gameModeContainer);

	settingPage.appendChild(blackContainer);
	body.append(settingPage);
}