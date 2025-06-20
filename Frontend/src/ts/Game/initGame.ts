import * as S from '../structs.js'
import { Game, log } from '../script.js'

export function startGame() {
	if (Game.opponentType == "1 vs 1") {

	} else if (Game.opponentType == "1 vs COM") {

	} else if (Game.opponentType == "Online") {

	} else {
		log("No opponent type choosen");
		return ;
	}

	if (Game.matchFormat == "single game") {

	} else if (Game.matchFormat == "tournament") {

	} else {
		log("No match format choosen");
		return ;
	}
	const mainPage = document.getElementById('mainPage');
	if (mainPage)
		mainPage.style.display = 'none';
	const game = document.getElementById('game');
	if (game)
		game.style.display = 'flex';
}

export function changeOpponentMode(option: string) {
	Game.opponentType = option;
}

export function changeMatchFormat(option: string) {
	Game.matchFormat = option;
}

// Get start position of ball
export function initPositions() {
	const ball = document.getElementById("ball");
	const playerOne = document.getElementById("rPlayer");
	const playerTwo = document.getElementById("lPlayer");
	const field = document.getElementById("field");

	if (ball && playerOne && playerTwo && field)
	{
		// Field
		S.Objects["field"].width = window.innerWidth * 0.8;
		S.Objects["field"].height = S.Objects["field"].width * (7 / 10);
		field.style.height = `${S.Objects["field"].height}px`;
		field.style.width = `${S.Objects["field"].width}px`;

		// Ball
		ball.style.height = `${S.Objects["field"].width * 0.05}px`;
		ball.style.width = `${S.Objects["field"].width * 0.05}px`;
		S.Objects["ball"].height = ball.clientHeight;
		S.Objects["ball"].width = ball.clientWidth;
		S.Objects["ball"].x = (field.clientWidth / 2) - (S.Objects["ball"].width / 2);
		S.Objects["ball"].y = (field.clientHeight / 2) - (S.Objects["ball"].height / 2);

		// Players
		playerOne.style.height = `${S.Objects["field"].height * 0.30}px`;
		playerTwo.style.height = `${S.Objects["field"].height * 0.30}px`;
		playerOne.style.width = `${S.Objects["field"].width * 0.02}px`;
		playerTwo.style.width = `${S.Objects["field"].width * 0.02}px`;
		S.Objects["p1"].height = playerOne.clientHeight;
		S.Objects["p1"].width = playerOne.clientWidth;
		S.Objects["p1"].y = playerOne.offsetTop;
		S.Objects["p1"].x = playerOne.offsetLeft;
		S.Objects["p2"].y = playerTwo.offsetTop;
		S.Objects["p2"].x = 0;
	} else {
		console.log("Something went wrong, close game?");
	}
}
