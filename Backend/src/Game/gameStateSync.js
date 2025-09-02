import { state } from "../SharedBuild/enums.js"
import { handleMatchEventDB } from '../Services/matchService.js';
import { db } from '../index.js';
import { updatePaddlePos } from "../SharedBuild/gameLogic.js"

export function applyGameStateUpdate(match, msg) {
	match.gameState = msg.gameState;
}

export function sendGameStateUpdate(match, io) {
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'gameStateUpdate',
		matchID: match.matchID,
		gameState: match.gameState,
		state: match.state
	});
}

export function applyKeyPressUpdate(match, msg) {
	let paddle = match.player1.ID == msg.id ? match.gameState.paddle1 : match.gameState.paddle2;
	console.log(`player1ID = ${match.player1.ID} -- player2ID = ${match.player2.ID}`)
	if (msg.key == 'ArrowDown') paddle.velocity.vy = msg.pressed ? paddle.movement.speed : 0;
	if (msg.key == 'ArrowUp') paddle.velocity.vy = msg.pressed ? -paddle.movement.speed : 0;
	console.log(`paddleVY = ${paddle.velocity.vy} -- paddleSpeed = ${paddle.movement.speed}`);
}

export async function updateScore(match, msg, io) {
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
	return eventID;
}

export function sendScoreUpdate(match, io) {
	if (match.player1.score >= 5 || match.player2.score >= 5)
		match.state = state.End;

	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'scoreUpdate',
		matchID: match.matchID,
		match: {
			state: match.state,
			gameState: match.gameState,
			lastScoreID: match.lastScoreID,
			player1: {
				score: match.player1.score
			},
			player2: {
				score: match.player2.score
			}
		}
	});
}
