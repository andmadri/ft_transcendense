import { GameStats, d } from "../structs.js";

export function processInputClient(match, data) {
	const player = match.player1.id == data.id ? match.player1 : match.player2;

	const steps = data.steps;
	for (const step of steps) {
		player.paddle = step.player[0];
		player.pressUp = step.player[1];
		player.pressDown = step.player[2];

		match.ball.x = step.ball[0];
		match.ball.y = step.ball[1];
		match.ball.angle = step.ball[2];
		match.ball.speed = step.ball[3];
		// plays the game on the server
	}
	updateClients(match);
}

export function updateClients(roomID) {
	const data = {
		action: 'game',
		subaction: 'update',
		time: time(),
		p1: [match.player1.id, match.player1.paddle],
		p2: [match.player2.id, match.player2.paddle],
		b:	[match.ball.x, match.ball.y, match.ball.angle, match.ball.speed],
		score: [match.player1.score, match.player2.score]				
	}

	io.to(match.roomID).emit('game-upade', data);
}
