import { pauseBallTemporarily } from './Game/gameLogic.js';
import * as S from './structs.js';
import { Game } from './script.js';

export function releaseButton(e: KeyboardEvent) {
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		S.Keys[e.key].pressed = false;
	}
}

export function pressButton(e: KeyboardEvent) {
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		S.Keys[e.key].pressed = true;
	}
}

//After I resize there should be the pause of the ball, a little twink and then 
export function initAfterResize() {
	const ball = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	const field = document.getElementById('field');
	const game = document.getElementById('game');

	if (ball && rPlayer && lPlayer && field && game) {
		
		
		const oldWidth = S.Objects['field'].width;
		const oldHeight = S.Objects['field'].height;
		const newWidth = field.clientWidth;
		const newHeight = field.clientHeight;
		
		S.Objects['field'].width = newWidth;
		S.Objects['field'].height = newHeight;
		
		//so ball rPlayer and lPlayer will always adapt according to the parent container therefore, we just need to
		//update the values of them from what we have already
		const relativeXBall = S.Objects['ball'].x / oldWidth;
		const relativeYBall = S.Objects['ball'].y / oldHeight;
		
		S.Objects['ball'].width = ball.clientWidth;
		S.Objects['ball'].height = ball.clientHeight;
		S.Objects['ball'].x = newWidth / 2;
		S.Objects['ball'].y = newHeight / 2;
		ball.style.left = `${S.Objects['ball'].x}px`;
		ball.style.top = `${S.Objects['ball'].y}px`;
		
		const relativeXlPlayer = S.Objects['lPlayer'].x / oldWidth;
		const relativeYlPlayer = S.Objects['lPlayer'].y / oldHeight;

		S.Objects['lPlayer'].width = lPlayer.clientWidth;
		S.Objects['lPlayer'].height = lPlayer.clientHeight;
		S.Objects['lPlayer'].x = relativeXlPlayer * newWidth;
		S.Objects['lPlayer'].y = relativeYlPlayer * newHeight;
		lPlayer.style.left = `${S.Objects['lPlayer'].x}px`;
		lPlayer.style.top = `${S.Objects['lPlayer'].y}px`;
		// S.Objects['lPlayer'].speed
		
		const relativeXrPlayer = S.Objects['rPlayer'].x / oldWidth;
		const relativeYrPlayer = S.Objects['rPlayer'].y / oldHeight;
		
		S.Objects['rPlayer'].width = rPlayer.clientWidth;
		S.Objects['rPlayer'].height = rPlayer.clientHeight;
		S.Objects['rPlayer'].x = relativeXrPlayer * newWidth;
		S.Objects['rPlayer'].y = relativeYrPlayer * newHeight;
		rPlayer.style.left = `${S.Objects['rPlayer'].x}px`;
		rPlayer.style.top = `${S.Objects['rPlayer'].y}px`;
		// S.Objects['rPlayer'].speed
		
		pauseBallTemporarily(3000);
	} else {
		console.log('Something went wrong (initAfterResizing), close game?');
	}
}