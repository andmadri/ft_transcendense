import * as S from './structs.js'

export function releaseButton(e: KeyboardEvent) {
	if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s") {
		S.Keys[e.key].pressed = false;
	}
}

export function pressButton(e: KeyboardEvent) {
	if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s") {
		S.Keys[e.key].pressed = true;
	}
}

export function initAfterResize() {
	const ball = document.getElementById("ball");
	const playerOne = document.getElementById("rPlayer");
	const playerTwo = document.getElementById("lPlayer");
	const field = document.getElementById("field");

	if (ball && playerOne && playerTwo && field) {
		const newWidth = window.innerWidth * 0.8;
		const newHeight = newWidth * 0.7;

		const scaleFactorX = newWidth / S.Objects["field"].width;
		const scaleFactorY = newHeight / S.Objects["field"].height;

		S.Objects["field"].width = newWidth;
		S.Objects["field"].height = newHeight;
		field.style.width = `${S.Objects["field"].width}px`;
		field.style.height = `${S.Objects["field"].height}px`;

		// Ball
		S.Objects["ball"].x *= scaleFactorX;
		S.Objects["ball"].y *= scaleFactorY;
		S.Objects["ball"].width *= scaleFactorX;
		S.Objects["ball"].height *= scaleFactorY;
		ball.style.left = `${S.Objects["ball"].x}px`;
		ball.style.top = `${S.Objects["ball"].y}px`;
		ball.style.width = `${S.Objects["ball"].width}px`;
		ball.style.height = `${S.Objects["ball"].height}px`;

		// Player 1
		S.Objects["p1"].y *= scaleFactorY;
		S.Objects["p1"].width *= scaleFactorX;
		S.Objects["p1"].height *= scaleFactorY;
		playerOne.style.left = `${S.Objects["p1"].x}px`;
		playerOne.style.top = `${S.Objects["p1"].y}px`;
		playerOne.style.width = `${S.Objects["p1"].width}px`;
		playerOne.style.height = `${S.Objects["p1"].height}px`;

		// Player 2
		S.Objects["p2"].y *= scaleFactorY;
		S.Objects["p2"].width *= scaleFactorX;
		S.Objects["p2"].height *= scaleFactorY;
		playerTwo.style.left = `${S.Objects["p2"].x}px`;
		playerTwo.style.top = `${S.Objects["p2"].y}px`;
		playerTwo.style.width = `${S.Objects["p2"].width}px`;
		playerTwo.style.height = `${S.Objects["p2"].height}px`;

	} else {
		console.log("Something went wrong, close game?");
	}
}