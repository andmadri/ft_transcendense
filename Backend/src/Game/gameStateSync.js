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

export async function updateMatchEventsDB(match, msg, gameState, event) {
	if (event !== "serve" && event !== "goal" && event !== "hit") {
		console.error(`updateMatchEventsDB: invalid event - ${event} | Should be 'serve', 'goal', 'hit'`);
		return ;
	}
	// console.log(`updateMatchEventsDB: ${event} | ballX = ${gameState.ball.pos.x} - ballY = ${gameState.ball.pos.y}`);

	// Find the correct player - or not
	let user_id = null;
	if (event !== "serve") {
		if (event == "goal") {
			user_id = msg.player;
		} else if (gameState.ball.pos.x < 0.5) {
			user_id = match.player1.ID;
		} else {
			user_id = match.player2.ID;
		}
	}

	const eventID = handleMatchEventDB(db, {
		match_id: msg.matchID,
		user_id: user_id, //msg.player == match.player1.ID ? match.player2.ID : match.player1.ID, // Should be the other player, I think
		event_type: event,
		ball_x: gameState.ball.pos.x,
		ball_y: gameState.ball.pos.y,
		// ball_angle: ,
		// ball_result_x: ,
		// ball_result_y: ,
		paddle_x_player_1: gameState.paddle1.pos.x,
		paddle_y_player_1: gameState.paddle1.pos.y,
		paddle_x_player_2: gameState.paddle2.pos.x,
		paddle_y_player_2: gameState.paddle2.pos.y
		// paddle_x_player_1: match.gameState.paddle1.pos.x,
		// paddle_y_player_1: match.gameState.paddle1.pos.y,
		// paddle_x_player_2: match.gameState.paddle2.pos.x,
		// paddle_y_player_2: match.gameState.paddle2.pos.y
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

export function sendServe(match, io) {
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'serve',
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

export function sendPadelHit(match, io) {
	io.to(match.matchID).emit('message', {
		action: 'game',
		subaction: 'padelHit',
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
