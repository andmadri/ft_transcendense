import { entity, player, matchInfo } from './types.js'
import { state } from './enums.js'

export function updateBallPos(ball: entity, field: any, deltaTime: number) {
	const ballRadius = ball.size.height / 2;
	ball.pos.x += ball.velocity.vx * deltaTime;
	ball.pos.y += ball.velocity.vy * deltaTime;
	if (ball.pos.y - ballRadius < 0)
		ball.pos.y = ballRadius;
	else if (ball.pos.y + ballRadius > field.size.height)
		ball.pos.y = field.size.height - ballRadius;
	if (ball.pos.x - ballRadius < 0)
		ball.pos.x = ballRadius;
	else if (ball.pos.x + ballRadius > field.size.width)
		ball.pos.x = field.size.width - ballRadius;
}

export function updatePaddlePos(paddle: entity, field: any, deltaTime: number) {
	const paddleHalfHeight = paddle.size.height / 2;
	const nextPos = paddle.pos.y + (paddle.velocity.vy * deltaTime);
	paddle.pos.y = Math.max(paddleHalfHeight, Math.min(nextPos, field.size.height - paddleHalfHeight));
}

export function randomizeBallAngle(ball: entity) {
	const minDeg = 0;
	const maxDeg = 45;
	const randomAngle = Math.random() * (maxDeg - minDeg) + minDeg;
	const radians = randomAngle * (Math.PI / 180);

	const vx = Math.cos(radians);
	const vy = Math.sin(radians) //* (1 / 0.75);

	const norm = Math.sqrt(vx * vx + vy * vy);

	const ux = vx / norm;
	const uy = vy / norm;

	ball.velocity.vx = ball.movement.speed * (Math.random() < 0.5 ? ux : -ux);
	ball.velocity.vy = ball.movement.speed * (Math.random() < 0.5 ? uy : -uy);
}

export function resetBall(ball: entity, field: any) {
	ball.pos.x = field.size.width / 2;
	ball.pos.y = field.size.height / 2;
	randomizeBallAngle(ball);
}

export function handleWallBounce(ball: entity, field: any) {
	const radius = ball.size.height / 2;
	if (ball.pos.y <= radius || ball.pos.y + radius >= field.size.height)
		ball.velocity.vy *= -1;
}

function changeVelocityOnPaddleBounce(ball: entity, player : entity) {
	const relativeHitPoint = ball.pos.y - player.pos.y;
	const normalizedHitPoint = relativeHitPoint / (player.size.height / 2);

	const maxBounceAngle = (Math.PI / 6)
	const angle = normalizedHitPoint * maxBounceAngle;

	const direction = ball.velocity.vx > 0 ? -1 : 1;

	const vx = Math.cos(angle) * direction;
	const vy = Math.sin(angle)

	const norm = Math.sqrt(vx * vx + vy * vy);

	const ux = vx / norm;
	const uy = vy / norm;

	ball.velocity.vx = ux * ball.movement.speed;
	ball.velocity.vy = uy * ball.movement.speed;
}

function handleScore(match: matchInfo, field: any, ball: entity, player: player) {
	match.state = state.Score;
	player.score++;
	match.lastScoreID = player.ID;
	// resetBall(ball, field); // Add data to DB: This should happen AFTER a message have been send to the backend
}

function checkPaddleCollision(match: matchInfo, field: any, ball: entity, paddle: entity, opponent: player) {
	const ballRadius = ball.size.height / 2;
	const paddleHalfWidth = paddle.size.width / 2;
	const paddleHalfHeight = paddle.size.height / 2;

	if ((ball.pos.y - ballRadius < paddle.pos.y + paddleHalfHeight) && (ball.pos.y + ballRadius > paddle.pos.y - paddleHalfHeight)) {
		match.state = state.Hit;
		changeVelocityOnPaddleBounce(ball, paddle);
	}
	else {
		handleScore(match, field, ball, opponent);
	}
}

function checkPaddleSides(match: matchInfo) {
	const { field, ball, paddle1, paddle2 } = match.gameState;
	const { player1, player2 } = match; 

	const ballRadius = ball.size.height / 2;
	const paddleHalfWidth = paddle1.size.width / 2;

	if (ball.velocity.vx > 0 && ball.pos.x + ballRadius >= paddle2.pos.x - paddleHalfWidth) {
		checkPaddleCollision(match, field, ball, paddle2, player1);
	}
	else if (ball.velocity.vx < 0 && ball.pos.x - ballRadius <= paddle1.pos.x + paddleHalfWidth) {
		checkPaddleCollision(match, field, ball, paddle1, player2);
	}
}

export function updateGameState(match: matchInfo, deltaTime: number) {
	const { field, ball, paddle1, paddle2 } = match.gameState;
	match.gameState.time = Date.now();
	if (match.player1.score == 5 || match.player2.score == 5) {
		match.state = state.End;
		return ;
	}
	if (match.state == state.Playing) {
		updateBallPos(ball, field, deltaTime);
		updatePaddlePos(paddle1, field, deltaTime);
		updatePaddlePos(paddle2, field, deltaTime);
		handleWallBounce(ball, field);
		checkPaddleSides(match);
	}
}