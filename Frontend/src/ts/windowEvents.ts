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
	const rPlayer = document.getElementById("rPlayer");
	const lPlayer = document.getElementById("lPlayer");
	const field = document.getElementById("field");

	if (ball && rPlayer && lPlayer && field) {
		const oldWidth = S.Objects["field"].width;
		const oldHeight = S.Objects["field"].height;

		const newWidth = window.innerWidth * 0.8;
		const newHeight = newWidth * 0.5833;

		const scaleFactorX = newWidth / oldWidth;
		const scaleFactorY = newHeight / oldHeight;

		S.Objects["ball"].x *= scaleFactorX;
		S.Objects["ball"].y *= scaleFactorY;
		S.Objects["ball"].width *= scaleFactorX;
		S.Objects["ball"].height *= scaleFactorY;

		ball.style.left = `${S.Objects["ball"].x}px`;
		ball.style.top = `${S.Objects["ball"].y}px`;
		ball.style.width = `${S.Objects["ball"].width}px`;
		ball.style.height = `${S.Objects["ball"].height}px`;

		S.Objects["rPlayer"].x *= scaleFactorX;
		S.Objects["rPlayer"].y *= scaleFactorY;
		S.Objects["rPlayer"].width *= scaleFactorX;
		S.Objects["rPlayer"].height *= scaleFactorY;

		rPlayer.style.left = `${S.Objects["rPlayer"].x}px`;
		rPlayer.style.top = `${S.Objects["rPlayer"].y}px`;
		rPlayer.style.width = `${S.Objects["rPlayer"].width}px`;
		rPlayer.style.height = `${S.Objects["rPlayer"].height}px`;

		S.Objects["lPlayer"].x *= scaleFactorX;
		S.Objects["lPlayer"].y *= scaleFactorY;
		S.Objects["lPlayer"].width *= scaleFactorX;
		S.Objects["lPlayer"].height *= scaleFactorY;

		lPlayer.style.left = `${S.Objects["lPlayer"].x}px`;
		lPlayer.style.top = `${S.Objects["lPlayer"].y}px`;
		lPlayer.style.width = `${S.Objects["lPlayer"].width}px`;
		lPlayer.style.height = `${S.Objects["lPlayer"].height}px`;

		S.Objects["field"].width = newWidth;
		S.Objects["field"].height = newHeight;

		field.style.width = `${newWidth}px`;
		field.style.height = `${newHeight}px`;

	} else {
		console.log("Something went wrong (initAfterResizing), close game?");
	}
}