import { changeOpponentType, changeMatchFormat, startGame } from "../Game/initGame.js";
// import { styleElement } from "../Menu/menuContent.js";

import { styleMainBtns } from "../Menu/menuContent";

// function styleBtn(btn: HTMLButtonElement, inRow: boolean) {
// 	styleElement(btn, {
// 		padding: '15px',
// 		fontSize: '16px',
// 		boxSizing: 'border-box',
// 	});
// 	if (inRow) {
// 		styleElement(btn, {
// 		width: '100%',
// 		flex: '1'
// 		});
// 	}
// }

// export function getGameSettings(): HTMLDivElement {
// 	const bts = document.createElement('div');
// 	bts.id = 'options';
// 	styleElement(bts, {
// 		gridColumn: '2',
// 		gridRow: '1',
// 		backgroundColor: 'white',
// 		alignItems: 'center',
// 		width: '100%',
// 		height: '100%',
// 		margin: '0 auto',
// 		padding: '20px',
// 		boxSizing: 'border-box'
// 	})

// 	const opponentTypesDiv = document.createElement('div');
// 	opponentTypesDiv.id = 'opponentTypes';
// 	opponentTypesDiv.className = 'opponentTypes';
// 	styleElement(opponentTypesDiv, {
// 		display: 'flex',
// 		gap: '10px',
// 		marginBottom: '10px',
// 		width: '100%',
// 		justifyContent: 'space-between',
// 	});	

// 	const btn1v1 = document.createElement('button');
// 	btn1v1.type = 'button';
// 	btn1v1.textContent = '1 VS 1';
// 	styleBtn(btn1v1, false);
// 	btn1v1.addEventListener('click', () => changeOpponentType('1 vs 1'));

// 	const btn1vCom = document.createElement('button');
// 	btn1vCom.type = 'button';
// 	btn1vCom.textContent = '1 VS COM';
// 	styleBtn(btn1vCom, false);
// 	btn1vCom.addEventListener('click', () => changeOpponentType('1 vs COM'));

// 	const btnOnline = document.createElement('button');
// 	btnOnline.type = 'button';
// 	btnOnline.textContent = 'Online';
// 	styleBtn(btnOnline, false);
	// btnOnline.addEventListener('click', () => changeOpponentType('Online'));

// 	opponentTypesDiv.append(btn1v1, btn1vCom, btnOnline);

// 	const matchTypesDiv = document.createElement('div');
// 	matchTypesDiv.className = 'opponentTypes';
// 	styleElement(matchTypesDiv, {
// 		display: 'flex',
// 		gap: '10px',
// 		marginBottom: '10px',
// 		width: '100%',
// 		justifyContent: 'space-between',
// 	});

// 	const btnSingleGame = document.createElement('button');
// 	btnSingleGame.type = 'button';
// 	btnSingleGame.textContent = 'single game';
// 	styleBtn(btnSingleGame, false);
// 	btnSingleGame.addEventListener('click', () => changeMatchFormat('single game'));

// 	const btnTournament = document.createElement('button');
// 	btnTournament.type = 'button';
// 	btnTournament.textContent = 'tournament';
// 	styleBtn(btnTournament, false);
// 	btnTournament.addEventListener('click', () => changeMatchFormat('tournament'));

// 	matchTypesDiv.append(btnSingleGame, btnTournament);

// 	const startBtn = document.createElement('button');
// 	startBtn.id = 'startGame';
// 	startBtn.type = 'button';
// 	startBtn.textContent = 'PLAY';
// 	styleBtn(startBtn, true);
// 	startBtn.addEventListener('click', () => startGame());

// 	bts.append(opponentTypesDiv, matchTypesDiv, startBtn);
// 	return (bts);
// }

// function getLeftSideOptionMenu() : HTMLDivElement {
// 	const optionLeft = document.createElement('div');
// 	styleElement(optionLeft, {
// 		display: 'flex',
// 		flexDirection: 'column',
// 		// width: '40%',
// 		boxSizing: 'border-box',
// 		justifyContent: 'space-between',
// 		height: '100%',
// 		alignItems: 'stretch'

// 	});
// 	optionLeft.append(getGameSettings());
// 	return (optionLeft);
// }

// function getRightSideOptionMenu() : HTMLDivElement {
// const optionRight = document.createElement('div');
// 	styleElement(optionRight, {
// 		display: 'flex',
// 		flexDirection: 'column',
// 		gap: '10px',
// 		padding: '15px',
// 		width: '50%',
// 		height: '100%',
// 		boxSizing: 'border-box',
// 		backgroundColor: 'white',
// 		flex: '1.5',
// 		borderRadius: '10px',
// 		alignItems: 'center'
// 	});

// 	// Add here possible extra options...

// 	return (optionRight);
// }


// export function getOptionMenu() {
// 	const settingPage = document.createElement('div');
// 	settingPage.id = 'settingPage';
// 	// styleElement(optionMenu, {
// 	// 	display: 'flex',
// 	// 	flexDirection: 'column',
// 	// 	backgroundColor: '#ffd400',
// 	// 	padding: '20px',
// 	// 	height: '100%',
// 	// 	width: '100%',
// 	// 	boxSizing: 'border-box'
// 	// });
// }

function styleSettingTitle(text: string): HTMLDivElement {
	const title = document.createElement('div');
	title.textContent = text;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.color = 'black';
	title.style.fontSize = 'clamp(20px, 1.5vw, 25px)';
	title.style.display = 'flex';
	title.style.justifyContent = 'center';
	title.style.alignItems = 'center';
	title.style.whiteSpace = 'nowrap';
	return title;
}

function styleSettingsBttns(button: HTMLButtonElement, text: string, opponent_type: string) {
	button.textContent = text;
	button.style.fontFamily = '"RobotoCondensed", sans-serif'
	button.style.backgroundColor = '#363430';
	button.style.color = 'white';
	button.style.border = 'none';
	button.style.flex = '1';
	button.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	button.style.fontSize = 'clamp(8px, 1vw, 10px)';

	button.addEventListener("mouseenter", () => {
		button.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
		button.style.color = 'black';
	});

	button.addEventListener("mouseleave", () => {
		button.style.background = '#363430';
		button.style.color = 'white';
	});

	button.addEventListener("click", () => {
		button.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
		changeOpponentType(opponent_type);
	})
}

export function getSettingsPage() {
	if (document.getElementById('settingPage'))
		return ;
	const body = document.getElementById('body');
	if (!body)
		return ;

	const settingPage = document.createElement('div');
	settingPage.id = 'settingPage';
	settingPage.style.width = '100%';
	settingPage.style.height = '100%';
	settingPage.style.margin = '0';
	settingPage.style.display = 'flex';
	settingPage.style.justifyContent = 'center';
	settingPage.style.alignItems = 'center';
	settingPage.style.backdropFilter = 'blur(6px)';

	const blackContainer = document.createElement('div');
	blackContainer.style.aspectRatio = '5/4';
	blackContainer.style.width = 'clamp(250px, 30vh, 350px)';
	blackContainer.style.borderRadius = '10px';
	blackContainer.style.padding = '0.7rem';
	blackContainer.style.background = 'black';
	// blackContainer.style.border = '2px solid black';
	blackContainer.style.justifyContent = 'center';
	blackContainer.style.gap = '0.7rem';
	blackContainer.style.display = 'flex';
	blackContainer.style.flexDirection = 'column';
	blackContainer.style.borderRadius = '10px';


	const settingContainer = document.createElement('div');
	settingContainer.id = 'settingContainer';
	settingContainer.style.borderRadius = '5px';
	settingContainer.style.color = 'black';
	settingContainer.style.gap = '0.7rem';
	settingContainer.style.background = 'white';
	

	const gameModeContainer = document.createElement('div');
	gameModeContainer.id = 'settingContainer';
	gameModeContainer.style.borderRadius = '5px';
	gameModeContainer.style.color = 'black';
	gameModeContainer.style.gap = '0.7rem';
	gameModeContainer.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';

	const settingTitle = styleSettingTitle('Settings');


	const gameModeTitle = styleSettingTitle('Game Mode');
	const gameModeButtons = document.createElement('div');


	const playGameButton = document.createElement('button');
	playGameButton.style.width = '70%';
	styleMainBtns(playGameButton, 'Play Game');
	playGameButton

	settingContainer.appendChild(settingTitle);
	gameModeContainer.appendChild(gameModeTitle);
	blackContainer.appendChild(settingContainer);
	blackContainer.appendChild(gameModeContainer);
	settingPage.appendChild(blackContainer);
	body.append(settingPage);
}