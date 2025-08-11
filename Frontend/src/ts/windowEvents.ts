import * as S from './structs.js'
import { Game} from './script.js'

const { field: fieldSize, ball: ballSize, lPlayer: lPlayerSize, rPlayer: rPlayerSize } = S.size;
const { field : fieldPos, ball: ballPos, lPlayer: lPlayerPos, rPlayer: rPlayerPos} = S.pos;
const { field : fieldMove, ball: ballMove, lPlayer: lPlayerMove, rPlayer: rPlayerMove } = S.movement;

export function releaseButton(e: KeyboardEvent) {
	if (Game.opponentType == S.OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		return ;
	}
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		S.Keys[e.key].pressed = false;
	}
}

export function pressButton(e: KeyboardEvent) {
	if (Game.opponentType == S.OT.ONEvsCOM && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
		return ;
	}
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		console.log(`Key pressed ${e.key}`);
		S.Keys[e.key].pressed = true;
	}
}

export function initAfterResize() {
	const ball = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	const field = document.getElementById('field');
	const game = document.getElementById('game');

	if (ball && rPlayer && lPlayer && field && game) {
		const oldWidth = fieldSize.width;
		const oldHeight = fieldSize.height;
		const newWidth = field.clientWidth;
		const newHeight = field.clientHeight;

		fieldSize.width = newWidth;
		fieldSize.height = newHeight;

		ballSize.width = ball.clientWidth;
		ballSize.height = ball.clientHeight;

		const relativeXball = ballPos.x / oldWidth;
		const relativeYball = ballPos.y / oldHeight;

		ballPos.x = relativeXball * newWidth;
		ballPos.y = relativeYball * newHeight;
		ball.style.left = `${ballPos.x}px`;
		ball.style.top = `${ballPos.y}px`;
		ballMove.speed = fieldSize.width * 0.01;
		
		const relativeXlPlayer = lPlayerPos.x / oldWidth;
		const relativeYlPlayer = lPlayerPos.y / oldHeight;

		lPlayerSize.width = lPlayer.clientWidth;
		lPlayerSize.height = lPlayer.clientHeight;
		lPlayerPos.x = relativeXlPlayer * newWidth;
		lPlayerPos.y = relativeYlPlayer * newHeight;
		lPlayer.style.left = `${lPlayerPos.x}px`;
		lPlayer.style.top = `${lPlayerPos.y}px`;
		lPlayerMove.speed = fieldSize.height * 0.015;

		const relativeXrPlayer = rPlayerPos.x / oldWidth;
		const relativeYrPlayer = rPlayerPos.y / oldHeight;

		rPlayerSize.width = rPlayer.clientWidth;
		rPlayerSize.height = rPlayer.clientHeight;
		rPlayerPos.x = relativeXrPlayer * newWidth;
		rPlayerPos.y = relativeYrPlayer * newHeight;
		rPlayer.style.left = `${rPlayerPos.x}px`;
		rPlayer.style.top = `${rPlayerPos.y}px`;
		rPlayerMove.speed = fieldSize.height * 0.015;

	} else {
		console.log('Something went wrong (initAfterResizing), close game?');
	}
}