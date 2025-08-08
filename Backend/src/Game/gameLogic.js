import { matches, Stage } from './gameMatch.js';
import { handleMatchEventDB } from '../Services/matchService.js';
import { db } from '../index.js';


export function updateBall(match, msg, socket) {
	if (match.stage != Stage.Playing)
		return ;
	// console.log("THIS ONLY HAPPENS ON A HIT!!");
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

export async function updateScore(match, msg, socket) {
	if (match.stage != Stage.Playing)
		return ;

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
	return eventID;
}
