import * as S from '../structs.js'
import { Game } from '../script.js'
import { movePadel } from './gameLogic.js'
import * as tf from '@tensorflow/tfjs'


// export const AI: S.AIInfo = {
// 	prediction : null,
// 	reactionTime : 1000, //ms
// 	lastReaction : 0,
// 	targetDirection : 'ArrowUp'
// };

// export function resetAI() {
// 	AI.prediction = null;
// 	AI.lastReaction = 0;
// 	AI.targetDirection = 'ArrowUp';
// }

// function predictBall() {
// 	const ball = S.Objects['ball'];
// 	const ballRadius = ball.width / 2;

// 	//calculate dx and dy
// 	const dx = Math.cos(ball.angle) * ball.speed;
// 	const dy = Math.sin(ball.angle) * ball.speed;

// 	//only predict if ball is moving towards AI
// 	if (dx <= 0) {
// 		AI.prediction = null;
// 		return ;
// 	}

// 	//do not repredict if dy is the same as previous prediction
// 	if (AI.prediction && Math.sign(dy) === Math.sign(Math.sin(ball.angle) * ball.speed)) {
// 		return ;
// 	}

// 	const field = S.Objects['field'];
// 	const paddle = S.Objects['rPlayer'];

// 	//predict ball Y on paddle X
// 	const distanceX = paddle.x - (ball.x + ballRadius);
// 	const timeToReach = distanceX / dx;
// 	const predictedY = ball.y + dy * timeToReach;

// 	//clamp y to stay within field
// 	const clampedY = Math.max(0, Math.min(predictedY, field.height));

// 	AI.prediction = {
// 		x : paddle.x,
// 		y : clampedY,
// 		dx : dx,
// 		dy : dy,
// 	}
// }

// export function aiAlgorithm() {
// 	const ball = S.Objects['ball'];
// 	const paddle = S.Objects['rPlayer'];

// 	if (Game.timeGame - AI.lastReaction > AI.reactionTime) {
// 		AI.lastReaction = Game.timeGame;
// 		predictBall()
// 	}
// 	if (AI.prediction) {
// 		if (AI.prediction.y > paddle.y) {
// 			AI.targetDirection = 'ArrowDown';
// 			movePadel(AI.targetDirection);
// 		}
// 		if (AI.prediction.y < paddle.y) {
// 			AI.targetDirection = 'ArrowUp';
// 			movePadel(AI.targetDirection);
// 		}
// 	}
// }

export async function loadModel() {
	let model;
	
	try {
		model = await tf.loadLayersModel('../../../aiTraining/model/model.json')
		console.log('Layers model succesfully loaded');
	}
	catch(error) {
		console.error('Error loading the model:', error );
	}
	return model;
}

export async function predictAction(model: any) {
	while ()
}