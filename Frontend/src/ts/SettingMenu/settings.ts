import { changeOpponentType, changeMatchFormat, startGame } from "../Game/initGame.js";
import { styleElement } from "../Menu/menuContent.js";

function styleBtn(btn: HTMLButtonElement, inRow: boolean) {
	styleElement(btn, {
		padding: '15px',
		fontSize: '16px',
		boxSizing: 'border-box',
	});
	if (inRow) {
		styleElement(btn, {
		width: '100%',
		flex: '1'
		});
	}
}

export function getGameSettings(): HTMLDivElement {
	const bts = document.createElement('div');
	bts.id = 'options';
	styleElement(bts, {
		gridColumn: '2',
		gridRow: '1',
		backgroundColor: 'white',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		margin: '0 auto',
		padding: '20px',
		boxSizing: 'border-box'
	})

	const opponentTypesDiv = document.createElement('div');
	opponentTypesDiv.id = 'opponentTypes';
	opponentTypesDiv.className = 'opponentTypes';
	styleElement(opponentTypesDiv, {
		display: 'flex',
		gap: '10px',
		marginBottom: '10px',
		width: '100%',
		justifyContent: 'space-between',
	});	

	const btn1v1 = document.createElement('button');
	btn1v1.type = 'button';
	btn1v1.textContent = '1 VS 1';
	styleBtn(btn1v1, false);
	btn1v1.addEventListener('click', () => changeOpponentType('1 vs 1'));

	const btn1vCom = document.createElement('button');
	btn1vCom.type = 'button';
	btn1vCom.textContent = '1 VS COM';
	styleBtn(btn1vCom, false);
	btn1vCom.addEventListener('click', () => changeOpponentType('1 vs COM'));

	const btnOnline = document.createElement('button');
	btnOnline.type = 'button';
	btnOnline.textContent = 'Online';
	styleBtn(btnOnline, false);
	btnOnline.addEventListener('click', () => changeOpponentType('Online'));

	opponentTypesDiv.append(btn1v1, btn1vCom, btnOnline);

	const matchTypesDiv = document.createElement('div');
	matchTypesDiv.className = 'opponentTypes';
	styleElement(matchTypesDiv, {
		display: 'flex',
		gap: '10px',
		marginBottom: '10px',
		width: '100%',
		justifyContent: 'space-between',
	});

	const btnSingleGame = document.createElement('button');
	btnSingleGame.type = 'button';
	btnSingleGame.textContent = 'single game';
	styleBtn(btnSingleGame, false);
	btnSingleGame.addEventListener('click', () => changeMatchFormat('single game'));

	const btnTournament = document.createElement('button');
	btnTournament.type = 'button';
	btnTournament.textContent = 'tournament';
	styleBtn(btnTournament, false);
	btnTournament.addEventListener('click', () => changeMatchFormat('tournament'));

	matchTypesDiv.append(btnSingleGame, btnTournament);

	const startBtn = document.createElement('button');
	startBtn.id = 'startGame';
	startBtn.type = 'button';
	startBtn.textContent = 'PLAY';
	styleBtn(startBtn, true);
	startBtn.addEventListener('click', () => startGame());

	bts.append(opponentTypesDiv, matchTypesDiv, startBtn);
	return (bts);
}

function getLeftSideOptionMenu() : HTMLDivElement {
	const optionLeft = document.createElement('div');
	styleElement(optionLeft, {
		display: 'flex',
		flexDirection: 'column',
		// width: '40%',
		boxSizing: 'border-box',
		justifyContent: 'space-between',
		height: '100%',
		alignItems: 'stretch'

	});
	optionLeft.append(getGameSettings());
	return (optionLeft);
}

function getRightSideOptionMenu() : HTMLDivElement {
const optionRight = document.createElement('div');
	styleElement(optionRight, {
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
		padding: '15px',
		width: '50%',
		height: '100%',
		boxSizing: 'border-box',
		backgroundColor: 'white',
		flex: '1.5',
		borderRadius: '10px',
		alignItems: 'center'
	});

	// Add here possible extra options...

	return (optionRight);
}

export function showSettingsPage() {
	if (document.getElementById('settingPage'))
		return ;

	const settingPage = document.createElement('div');
	settingPage.id = 'settingPage';
	styleElement(settingPage, {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#ffd400',
		padding: '20px',
		height: '100%',
		width: '100%',
		boxSizing: 'border-box'
	});

	const optionLeftRight = document.createElement('div');
	styleElement(optionLeftRight, {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: '20px',
		flex: '1'
	})

	optionLeftRight.append(getLeftSideOptionMenu(), getRightSideOptionMenu());
	settingPage.appendChild(optionLeftRight);

	const app = document.getElementById('app');
	if (!app)
		return ;
	app.innerHTML = '';
	app.append(settingPage);
}