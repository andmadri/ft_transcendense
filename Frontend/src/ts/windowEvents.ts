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

		const newWidth = window.innerWidth * 0.7;
		const newHeight = newWidth * (7 / 10);

		if (oldWidth === 0 || oldHeight === 0) {
			console.warn("Field too small!!");
			return;
		}

		const scaleFactor = Math.min(newWidth / oldWidth, newHeight / oldHeight);

		ballPos.x *= scaleFactor;
		ballPos.y *= scaleFactor;
		ballSize.width *= scaleFactor;
		ballSize.height *= scaleFactor;
		ballMove.speed *= scaleFactor;

		ball.style.left = `${ballPos.x}px`;
		ball.style.top = `${ballPos.y}px`;
		ball.style.width = `${ballSize.width}px`;
		ball.style.height = `${ballSize.height}px`;
		
		rPlayerPos.x *= scaleFactor;
		rPlayerPos.y *= scaleFactor;
		rPlayerSize.width *= scaleFactor;
		rPlayerSize.height *= scaleFactor;
		rPlayerMove.speed *= scaleFactor;

		rPlayer.style.left = `${rPlayerPos.x}px`;
		rPlayer.style.top = `${rPlayerPos.y}px`;
		rPlayer.style.width = `${rPlayerSize.width}px`;
		rPlayer.style.height = `${rPlayerSize.height}px`;

		lPlayerPos.x *= scaleFactor;
		lPlayerPos.y *= scaleFactor;
		lPlayerSize.width *= scaleFactor;
		lPlayerSize.height *= scaleFactor;
		lPlayerMove.speed *= scaleFactor;

		lPlayer.style.left = `${lPlayerPos.x}px`;
		lPlayer.style.top = `${lPlayerPos.y}px`;
		lPlayer.style.width = `${lPlayerSize.width}px`;
		lPlayer.style.height = `${lPlayerSize.height}px`;

		game.style.width = `${newWidth}px`;
		game.style.height = `${newHeight}px`;

		field.style.width = `${newWidth}px`;
		field.style.height = `${newHeight}px`;

		fieldSize.width = newWidth;
		fieldSize.height = newHeight;
	} else {
		console.log('Something went wrong (initAfterResizing), close game?');
	}
}