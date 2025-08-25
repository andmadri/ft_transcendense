import { state } from "../SharedBuild/enums.js"
import { handleMatchEventDB } from '../Services/matchService.js';
import { db } from '../index.js';

export function applyGameStateUpdate(match, msg) {
	match.gameState = msg.gameState;
}

export function sendBallUpdate(match, msg, socket, io) {
	if (match.state != state.Playing)
		return ;
	// console.log("THIS ONLY HAPPENS ON A HIT!!");
	match.ball.angle = msg.ballAngle; // this not
	match.ball.x = msg.ballX;
	match.ball.y = msg.ballY;
	// match.ball.vX = msg.ballVX;
	// match.ball.vY = msg.ballVY;

	// update msg
	io.to(match.matchID).emit('message', msg);
}

export function sendGameStateUpdate(match) {
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'gameStateUpdate',
		match: match
	});
}

export function sendPaddleUpdate(match, msg, socket, io) {
	if (match.state != state.Playing)
		return ;

	msg.player1Score = match.player1.score;
	msg.player1Paddle = match.player1.paddleY;
	msg.player1paddleVY = match.player1.paddleVY;
	msg.player1Up = match.player1.pressUp;
	msg.player1Down = match.player1.pressDown;
	msg.player2Score = match.player2.score;
	msg.player2Paddle = match.player2.paddleY;
	msg.player2Up = match.player2.pressUp;
	msg.player2Down = match.player2.pressDown;

	// msg.paddle1VY
	// msg.paddle2VY
	io.to(match.matchID).emit('message', msg);
}

export function applyKeyPressUpdate(match, msg) {
	let paddle = match.player1.ID == msg.id ? match.paddle1 : match.paddle2;
	if (msg.key == 'ArrowDown') paddle.vy = msg.pressed ? -paddle.movement.speed : 0;
	if (msg.key == 'ArrowUp') paddle.vy = msg.pressed ? paddle.movement.speed : 0;
}

export async function updateScore(match, msg, io) {
	if (match.state != state.Playing)
		return ;

	console.log("updateScore -> handleMatchEventDB")
	const eventID = await handleMatchEventDB(db, {
		match_id: msg.matchID,
		user_id: msg.player == match.player1.ID ? match.player2.ID : match.player1.ID, // Should be the other player, I think
		event_type: 'goal'
		// ball_x: ,
		// ball_y: ,
		// ball_angle: ,
		// ball_result_x: ,
		// ball_result_y: ,
		// paddle_x_player_1: ,
		// paddle_y_player_1: ,
		// paddle_x_player_2: ,
		// paddle_y_player_2: ,
	})

	// update msg -> not send to socket but to room.
	// io.to(match.matchID).emit('message', msg);

	return eventID;
}
