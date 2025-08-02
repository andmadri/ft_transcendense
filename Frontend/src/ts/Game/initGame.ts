import * as S from '../structs'
import { E } from '../structs'
import { Game } from '../script.js'
import { log } from '../logging.js'
import { getGameField } from './gameContent.js';
import { updateNamesMenu, resetScoreMenu } from '../SideMenu/SideMenuContent.js';

export function startGame() {
	switch (Game.opponentType) {
		case S.OT.ONEvsONE: {
			Game.state = S.State.Login;		
			break ;
		}
		case S.OT.ONEvsCOM: {
			Game.state = S.State.Game;
			break ;
		}
		case S.OT.Online: {
			Game.state = S.State.Pending;
			break ;
		}
		default: {
			log('No opponent type choosen');
			return ;
		}
	}

	switch (Game.matchFormat) {
		case S.MF.Tournament: {
			// create tournament once?
			break ;
		}
		case S.MF.Tournament: {
			// create tournament once?
			break ;
		}
		default: {
			log('No match format choosen');
			return ;
		}
	}
	log('Game state after startGame: ' + Game.state);
}

export function changeOpponentType(option: string) {
	switch (option) {
		case '1 vs 1':
			Game.opponentType = S.OT.ONEvsONE;
			break ;
		case '1 vs COM':
			Game.opponentType = S.OT.ONEvsCOM;
			break ;
		case 'online':
			Game.opponentType = S.OT.Online;
			break ;
		default:
			log(`unknown opponent type? ${option}`);
	}
}

export function changeMatchFormat(option: string) {
	switch (option) {
		case 'single game':
			Game.matchFormat = S.MF.SingleGame;
			break ;
		case 'tournament':
			Game.matchFormat = S.MF.Tournament;
			break ;
		default:
			log(`unknown match format? ${option}`);
	}	
}

function scaleToField(fieldDim: number, unit : number) : number {
	return (fieldDim * unit);
}

function initSpeed() {
	const fieldSize = S.size[E.field];
	const fieldUnit = S.unitSize[E.field];

	for (const e of [E.ball, E.lPlayer, E.rPlayer]) {
		if (S.movement[e] && S.unitSize[e]) {
			S.movement[e].speed = scaleToField(fieldSize.width, S.unitMovement[e].speed);
		}
	}
}

function scaleGameSizes() {
	const fieldSize = S.size[E.field];
	const fieldUnit = S.unitSize[E.field];

	fieldSize.width = window.innerWidth * 0.7;
	fieldSize.height = fieldSize.width * fieldUnit.height;

	for (const e of [E.ball, E.lPlayer, E.rPlayer]) {
		if (S.size[e] && S.unitSize[e]) {
			S.size[e].width = scaleToField(fieldSize.width, S.unitSize[e].width);
			S.size[e].height = scaleToField(fieldSize.height, S.unitSize[e].height);
		}
	}
}

function scaleGamePos() {
	const fieldSize = S.size[E.field];

	for (const e of [E.ball, E.lPlayer, E.rPlayer]) {
		if (S.pos[e] && S.unitPos[e]) {
			S.pos[e].x = scaleToField(fieldSize.width, S.unitPos[e].x);
			S.pos[e].y = scaleToField(fieldSize.width, S.unitPos[e].y);
		}
	}
}

export function initDOMSizes() {
	const ballEl = document.getElementById('ball');
	const lPlayerEl = document.getElementById('rPlayer');
	const rPlayerEl = document.getElementById('lPlayer');
	const fieldEl = document.getElementById('field');
	const gameEl = document.getElementById('game');

	const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
	const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos} = S.pos;

	if (ballEl && lPlayerEl && rPlayerEl && fieldEl && gameEl)
	{
		// Size
		fieldEl.style.height = `${fieldSize.height}px`;
		fieldEl.style.width = `${fieldSize.width}px`;
		gameEl.style.height = `${fieldSize.height}px`;
		gameEl.style.width = `${fieldSize.width}px`;

		ballEl.style.height = `${ballSize.height * 2}px`;
		ballEl.style.width = `${ballSize.width * 2}px`;

		lPlayerEl.style.height = `${lPlayerSize.height}px`;
		lPlayerEl.style.width = `${lPlayerSize.width}px`;
		rPlayerEl.style.height = `${rPlayerSize.height}px`;
		rPlayerEl.style.width = `${rPlayerSize.width}px`;

		//Pos
		ballEl.style.left = `${ballPos.x - ballSize.width / 2}px`;
		ballEl.style.top = `${ballPos.y - ballSize.width / 2}px`;

		lPlayerPos.y = lPlayerEl.offsetTop;
		rPlayerPos.x = lPlayerEl.offsetLeft;
		lPlayerPos.y = rPlayerEl.offsetTop;
		rPlayerPos.x = rPlayerEl.offsetLeft;
	} else {
		console.log('Something went wrong (initGame), close game?');
	}
}

export function initGameServer() {
	if (Game.socket.readyState == WebSocket.OPEN) {
		if (Game.opponentType != S.OT.Online) {
			const initGame1 = {
				action: 'game',
				subaction: 'init',
				player: 'one',
				playerId: Game.id,
				playerName: Game.name,
			}
			Game.socket.send(JSON.stringify(initGame1));
		}
		if (Game.opponentType == S.OT.ONEvsONE) {
			const initGame2 = {
				action: 'game',
				subaction: 'init',
				player: 'two',
				playerId: Game.id2,
				playerName: Game.name2,
			}
			Game.socket.send(JSON.stringify(initGame2));
		}
		else if (Game.opponentType == S.OT.ONEvsCOM) {
			const initGame2 = {
				action: 'game',
				subaction: 'init',
				player: 'two',
				playerId: -1,
				playerName: 'Computer',
			}
			Game.socket.send(JSON.stringify(initGame2));
		}
		else {
			const initGame = {
				action: 'game',
				subaction: 'init',
				player: 'one', // or two...decide by server?
				playerId: Game.id,
				playerName: Game.name,
			}
			Game.socket.send(JSON.stringify(initGame));
		}
	}
}

export function initGame() {
	getGameField();
	scaleGameSizes();
	scaleGamePos();
	initDOMSizes();
	initGameServer();
	updateNamesMenu();
	resetScoreMenu();
}
