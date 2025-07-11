import { GameStats } from "../structs.js";

export function initGame(msg, socket) {
	if (msg.player == 'one')
	{
		GameStats.player1.id = msg.playerId;
		GameStats.player1.name = msg.playerName;
	} 
	else if (msg.player == 'two') {
		GameStats.player2.id = msg.playerId;
		GameStats.player2.name = msg.playerName;
	}
	GameStats.ball.angle = msg.ballAngle;
	GameStats.ball.x = msg.ballX;
	GameStats.ball.y = msg.ballY;
}

export function update(msg, socket) {
	if (msg.action == 'ballUpdate') {
		GameStats.ball.angle = msg.ballAngle;
		GameStats.ball.x = msg.ballX;
		GameStats.ball.y = msg.ballY;
	}

	if (msg.action == 'padelUpdate') {
		msg.player1Score = GameStats.player1.score;
		msg.player1Paddle = GameStats.player1.paddle;
		msg.player1Up = GameStats.player1.pressUp;
		msg.player1Down = GameStats.player1.pressDown;

		msg.player2Score = GameStats.player2.score;
		msg.player2Paddle = GameStats.player2.paddle;
		msg.player2Up = GameStats.player2.pressUp;
		msg.player2Down = GameStats.player2.pressDown;
	}
	socket.send(JSON.stringify(msg));
}
