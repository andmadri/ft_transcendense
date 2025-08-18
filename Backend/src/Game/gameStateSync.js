import { Stage } from "../SharedBuild/enums.js"
import { handleMatchEventDB } from '../Services/matchService.js';
import { db } from '../index.js';

export function sendBallUpdate(match, msg, socket, io) {
	if (match.stage != Stage.Playing)
		return ;
	// console.log("THIS ONLY HAPPENS ON A HIT!!");
	match.ball.angle = msg.ballAngle; // this not
	match.ball.x = msg.ballX;
	match.ball.y = msg.ballY;
	// match.ball.vX = msg.ballVX;
	// match.ball.vY = msg.ballVY;

	// update msg
	io.to(match.roomID).emit('message', msg);
}

export function sendPaddleUpdate(match, msg, socket, io) {
	if (match.stage != Stage.Playing)
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
	io.to(match.roomID).emit('message', msg);
}

export function applyKeyPress(match, msg) {
	let playerObj
	if (match.player1.id == msg.id) {
		playerObj = match.player1;
	}
	else if (match.player2.id == msg.id) {
		playerObj = match.player2;
	}
	if (msg.key == 'ArrowUp') {
		playerObj.pressUp = msg.pressed;
	}
	else if (msg.key =='ArrowDown') {
		playerObj.pressDown = msg.pressed;
	}
}

export async function updateScore(match, msg, io) {
	if (match.stage != Stage.Playing)
		return ;

	console.log("updateScore -> handleMatchEventDB")
	const eventID = await handleMatchEventDB(db, {
		match_id: msg.matchID,
		user_id: msg.player == match.player1.id ? match.player2.id : match.player1.id, // Should be the other player, I think
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
	// io.to(match.roomID).emit('message', msg);

	return eventID;
}
