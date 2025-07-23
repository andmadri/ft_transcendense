import { matches, Stage } from './gameMatch.js';

export function updateBall(match, msg, socket) {
	if (match.stage != Stage.Playing)
		return ;
	match.ball.angle = msg.ballAngle;
	match.ball.x = msg.ballX;
	match.ball.y = msg.ballY;
	socket.send(JSON.stringify(msg));
}

export function updatePadel(match, msg, socket) {
	if (match.stage != Stage.Playing)
		return ;
	msg.player1Score = match.player1.score;
	msg.player1Paddle = match.player1.paddle;
	msg.player1Up = match.player1.pressUp;
	msg.player1Down = match.player1.pressDown;
	msg.player2Score = match.player2.score;
	msg.player2Paddle = match.player2.paddle;
	msg.player2Up = match.player2.pressUp;
	msg.player2Down = match.player2.pressDown;
	socket.send(JSON.stringify(msg));
}

export function updateScore(match, msg, socket) {
	if (match.stage != Stage.Playing)
		return ;

	if (match.player1.id == msg.playerID)
		match.player1.score++;
	else
		match.player2.score++;
}