import { gameState } from '@shared/types'
import { UI, Game } from '../gameData.js'

const INTERPOLATION_DELAY = 100;
const MAX_SNAPSHOT_AGE = 2000;

interface Snapshot {
	ballX: number;
	ballY: number;
	ballVY: number;
	ballVX: number;
	paddleY: number;
	paddleVY: number;
	timestamp: number;
}

const snapshots: Snapshot[] = [];

/**
 * @brief adds the current values as a snapshot to snapshots
 * @param match must contain: ballY + X, ballVY + X, paddleOneY, paddleTwoY
 * @param player 1 or 2, dependce on left/right correction
 */
function makeSnapshot(gameState: any, player: number) {
	snapshots.push({
		ballX: gameState.ball.pos.x,
		ballY: gameState.ball.pos.y,
		ballVX: gameState.ball.velocity.vx,
		ballVY: gameState.ball.velocity.vy,
		paddleY: player == 1 ? gameState.paddle2.pos.y : gameState.paddle1.pos.y,
		paddleVY: player == 1 ? gameState.paddle2.velocity.vy : gameState.paddle1.velocity.vy,
		timestamp: Date.now(),
	});
}

/**
 * @brief search for the snapshots (closest) before and after the rendertime.
 * @param renderTime delayed time from now()
 * @returns 2 snapshots or null if not found
 */
function getBoundingSnapshots(renderTime: number) {
	let snap1: Snapshot | null = null;
	let snap2: Snapshot | null = null;

	if (snapshots.length === 1) {
		snap1 = snapshots[0];
		return [snap1, null];
	}
	// search for the two frames (One older than rendertime and one newer than rendertime)
	for (let i = 0; i < snapshots.length - 1; i++) {
		if (snapshots[i].timestamp <= renderTime && snapshots[i + 1].timestamp >= renderTime) {
			snap1 = snapshots[i];
			snap2 = snapshots[i + 1];
			break;
		}
	}
	return [snap1, snap2];
}

/**
 * @brief updates the positions of the divElements in the frontend
 */
// function updateRenderFromSnapshot(ballX: number, ballY: number, paddleY: number, playerNr: number) {
// 	const playerDiv = playerNr == 1 ? document.getElementById('rPlayer') : document.getElementById('lPlayer');
// 	const ballDiv = document.getElementById('ball');
// 	const fieldDiv = document.getElementById('field');

// 	if (!ballDiv || !playerDiv || !fieldDiv) {
// 		console.error("Div elements are missing applyUpdatesGameServer");
// 		return;
// 	}
// 	// Change values in div elements
// 	playerDiv.style.top = `${(paddleY * fieldDiv.clientWidth) - (playerDiv.clientHeight / 2)}px`;
// 	ballDiv.style.left = `${ballX * fieldDiv.clientWidth}px`;
// 	ballDiv.style.top = `${ballY * fieldDiv.clientWidth}px`;
// }

function updateRenderFromSnapshot(ballX: number, ballY: number, paddleY: number, playerNr: number) {
	const paddle = playerNr == 1 ? Game.match.gameState.paddle2 : Game.match.gameState.paddle1;
	const ball = Game.match.gameState.ball;
	paddle.pos.y = paddleY;
	ball.pos.y = ballY;
	ball.pos.x = ballX;
}

/**
 * @brief calculates the pos of ball and paddle between the two snapshots
 * @param snap1 snapshot before the rendertime
 * @param snap2 snapshot after the rendertime
 * @param renderTime delayed time from now()
 * @param player left or right
 */
function interpolateSnapshot(snap1: Snapshot, snap2: Snapshot, renderTime: number, player: number) {
	// calculate the right position at the right delay time
	if (snap2.timestamp <= snap1.timestamp) {
		console.error("Invalid snapshots: snap2.timestamp must be greater than snap1.timestamp");
		return;
	}

	const t = (Date.now() - snap1.timestamp) / (snap2.timestamp - snap1.timestamp);
	const fraction = Math.min(Math.max(t, 0), 1);

	const ballX = snap1.ballX + (snap2.ballX - snap1.ballX) * fraction;
	const ballY = snap1.ballY + (snap2.ballY - snap1.ballY) * fraction;
	const paddleY = snap1.paddleY + (snap2.paddleY - snap1.paddleY) * fraction;

	updateRenderFromSnapshot(ballX, ballY, paddleY, player);
}

/**
 * @brief Predict the position of ball and paddle is there is a server delay
 * @param snap1 last snapshot that is made
 * @param player left or right player
 */
function extrapolateFromSnapshot(snap1: Snapshot, player: number) {
	const deltaTime = Date.now() - snap1.timestamp;

	const vX = snap1.ballVX;
	const vY = snap1.ballVY;
	const paddleVY = snap1.paddleVY;

	const predictNewBallX = snap1.ballX + vX * (deltaTime / 1000);
	const predictNewBallY = snap1.ballY + vY * (deltaTime / 1000);
	const predictNewPaddleY = snap1.paddleY + paddleVY * (deltaTime / 1000);

	updateRenderFromSnapshot(predictNewBallX, predictNewBallY, predictNewPaddleY, player);
}

// Deletes the snapshots that are before the rendertime and till two are left
function deleteOldSnapshots(renderTime: number) {
	while (snapshots.length > 2 && snapshots[1].timestamp <= renderTime) {
		snapshots.shift();
	}
}

/**
 * @brief calculates the right time (interpolation) between two snapshots with a delay of INTERPOLATION_DELAY
 * @param data must contain: ballY, ballX, paddleOneY, paddleTwoY, paddleOneVY, paddleTwoVY, and playerNr (in match, left/right?)
 */
export function renderGameInterpolated(data: any) {
	if (data.gameState) {
		const playerNr = Game.match.player1.ID == UI.user1.ID ? 1 : 2;
		makeSnapshot(data.gameState, playerNr);
	}
	else {
		console.log("Data is missing in applyUpdatesGameServer");
		return;
	}

	const now = Date.now();
	const renderTime = now - INTERPOLATION_DELAY;

	const [snap1, snap2] = getBoundingSnapshots(renderTime);
	if (snap1 && snap2) {
		interpolateSnapshot(snap1, snap2, renderTime, data.playerNr);
		deleteOldSnapshots(renderTime);
	} 
	else if (snap1) {
		if (Date.now() - snap1.timestamp <= MAX_SNAPSHOT_AGE) {
			extrapolateFromSnapshot(snap1, data.playerNr);
		} else {
			console.error("snap1 is too old for extrapolation");
		}
	}
	
}