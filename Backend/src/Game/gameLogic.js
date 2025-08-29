import { handleMatchEventDB } from '../Services/matchService.js';
import { db } from '../index.js';
import { state } from "../SharedBuild/enums.js"

export function updateBall(match, msg, socket) {
	if (match.state != state.Playing)
		return ;
	// console.log("THIS ONLY HAPPENS ON A HIT!!");
	match.ball.angle = msg.ballAngle;
	match.ball.x = msg.ballX;
	match.ball.y = msg.ballY;

	// NOW the msg is just send back instead of updated (online if online)
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
	
	// NOW the msg is just send back instead of updated (online if online)
	socket.emit('message', msg);
}

export async function updateScore(match, msg, socket) {
	if (match.state != state.Playing)
		return ;

	console.log("updateScore -> handleMatchEventDB")
	const eventID = await handleMatchEventDB(db, {
		match_id: msg.matchID,
		user_id: msg.player == match.player1.ID ? match.player2.ID : match.player1.ID, // Should be the other player
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
	return eventID;
}

