import { state } from "../SharedBuild/enums.js"

export function updateBall(match, msg, socket) {
	if (match.state != state.Playing)
		return ;
	match.ball.angle = msg.ballAngle;
	match.ball.x = msg.ballX;
	match.ball.y = msg.ballY;
	socket.emit('message', msg);
}

export function updatePadel(match, msg, socket) {
	if (match.state != state.Playing)
		return ;
	msg.player1Score = match.player1.score;
	msg.player1Paddle = match.player1.paddle;
	msg.player1Up = match.player1.input.pressUP;
	msg.player1Down = match.player1.input.pressDOWN;
	msg.player2Score = match.player2.score;
	msg.player2Paddle = match.player2.paddle;
	msg.player2Up = match.player2.input.pressUP;
	msg.player2Down = match.player2.input.pressDOWN;
	socket.emit('message', msg);
}
