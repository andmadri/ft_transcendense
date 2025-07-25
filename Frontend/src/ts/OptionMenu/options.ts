import { changeOpponentType, changeMatchFormat, startGame } from "../Game/initGame.js";
import { styleElementMenu } from "../Menu/menuContent.js";

export function getGameSettings(): HTMLDivElement {
	const options = document.createElement('div');
	options.id = 'options';
	styleElementMenu(options, {
		gridColumn: '2',
		gridRow: '1',
		backgroundColor: 'white',
		padding: '1rem',
		borderBottom: '1px solid #000'
	})

	const opponentTypesDiv = document.createElement('div');
	opponentTypesDiv.id = 'opponentTypes';
	opponentTypesDiv.className = 'opponentTypes';

	const btn1v1 = document.createElement('button');
	btn1v1.type = 'button';
	btn1v1.textContent = '1 VS 1';
	btn1v1.addEventListener('click', () => changeOpponentType('1 vs 1'));

	const btn1vCom = document.createElement('button');
	btn1vCom.type = 'button';
	btn1vCom.textContent = '1 VS COM';
	btn1vCom.addEventListener('click', () => changeOpponentType('1 vs COM'));

	const btnOnline = document.createElement('button');
	btnOnline.type = 'button';
	btnOnline.textContent = 'Online';
	btnOnline.addEventListener('click', () => changeOpponentType('Online'));

	opponentTypesDiv.append(btn1v1, btn1vCom, btnOnline);

	const matchTypesDiv = document.createElement('div');
	matchTypesDiv.className = 'opponentTypes';

	const btnSingleGame = document.createElement('button');
	btnSingleGame.type = 'button';
	btnSingleGame.textContent = 'single game';
	btnSingleGame.addEventListener('click', () => changeMatchFormat('single game'));

	const btnTournament = document.createElement('button');
	btnTournament.type = 'button';
	btnTournament.textContent = 'tournament';
	btnTournament.addEventListener('click', () => changeMatchFormat('tournament'));

	matchTypesDiv.append(btnSingleGame, btnTournament);

	const startBtn = document.createElement('button');
	startBtn.id = 'startGame';
	startBtn.type = 'button';
	startBtn.textContent = 'PLAY';
	startBtn.addEventListener('click', () => startGame());

	options.append(opponentTypesDiv, matchTypesDiv, startBtn);

	return (options);
}

export function getOptionMenu() {
	const optionMenu = document.createElement('div');
	optionMenu.id = 'optionMenu';

	optionMenu.append(getGameSettings());

	const app = document.getElementById('app');
	if (!app)
		return ;
	app.innerHTML = '';
	app.append(optionMenu);
}