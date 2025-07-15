import * as S from './structs.js'

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

export function initAfterResize() {
	const ball = document.getElementById('ball');
	const rPlayer = document.getElementById('rPlayer');
	const lPlayer = document.getElementById('lPlayer');
	const field = document.getElementById('field');
	const game = document.getElementById('game');

	if (ball && rPlayer && lPlayer && field && game) {
		const oldWidth = S.Objects['field'].width;
		const oldHeight = S.Objects['field'].height;

		const newWidth = window.innerWidth * 0.7;
		const newHeight = newWidth * (7 / 10);

		if (oldWidth === 0 || oldHeight === 0) {
			console.warn("Field too small!!");
			return;
		}

		const scaleFactor = Math.min(newWidth / oldWidth, newHeight / oldHeight);

		S.Objects['ball'].x *= scaleFactor;
		S.Objects['ball'].y *= scaleFactor;
		S.Objects['ball'].width *= scaleFactor;
		S.Objects['ball'].height *= scaleFactor;

		ball.style.left = `${S.Objects['ball'].x}px`;
		ball.style.top = `${S.Objects['ball'].y}px`;
		ball.style.width = `${S.Objects['ball'].width}px`;
		ball.style.height = `${S.Objects['ball'].height}px`;

		S.Objects['rPlayer'].x *= scaleFactor;
		S.Objects['rPlayer'].y *= scaleFactor;
		S.Objects['rPlayer'].width *= scaleFactor;
		S.Objects['rPlayer'].height *= scaleFactor;

		rPlayer.style.left = `${S.Objects['rPlayer'].x}px`;
		rPlayer.style.top = `${S.Objects['rPlayer'].y}px`;
		rPlayer.style.width = `${S.Objects['rPlayer'].width}px`;
		rPlayer.style.height = `${S.Objects['rPlayer'].height}px`;

		S.Objects['lPlayer'].x *= scaleFactor;
		S.Objects['lPlayer'].y *= scaleFactor;
		S.Objects['lPlayer'].width *= scaleFactor;
		S.Objects['lPlayer'].height *= scaleFactor;

		lPlayer.style.left = `${S.Objects['lPlayer'].x}px`;
		lPlayer.style.top = `${S.Objects['lPlayer'].y}px`;
		lPlayer.style.width = `${S.Objects['lPlayer'].width}px`;
		lPlayer.style.height = `${S.Objects['lPlayer'].height}px`;

		game.style.width = `${newWidth}px`;
		game.style.height = `${newHeight}px`;

		field.style.width = `${newWidth}px`;
		field.style.height = `${newHeight}px`;

		S.Objects['field'].width = newWidth;
		S.Objects['field'].height = newHeight;

	} else {
		console.log('Something went wrong (initAfterResizing), close game?');
	}
}