import * as S from '../structs.js'
import { Game } from '../script.js'
import { movePadel } from './gameLogic.js'
import * as tf from '@tensorflow/tfjs'

let loadedModel: tf.LayersModel | null = null;
let lastPredictionTime = 0;

export function collectGameData(): number[] {
	const fieldWidth = S.Objects['field'].width;
	const fieldHeight = S.Objects['field'].height;
	const ball = S.Objects['ball'];
	const player = S.Objects['rPlayer'];
	const opponent = S.Objects['lPlayer'];

	//divide by width || height so data is normalized (relative to field size)
	return [
		Game.timeGame / 1000, //divide by 1000 to convert to seconds (because thats how we trained it)
		ball.x / fieldWidth,
		ball.y / fieldHeight,
		(Math.cos(ball.angle) * ball.speed) / fieldWidth,
		(Math.sin(ball.angle) * ball.speed) / fieldHeight,
		ball.speed / fieldWidth,
		player.y / fieldHeight,
		opponent.y / fieldHeight,
	]
}

export async function loadModel() {
	// let model;
	// console.log('Loadmodel()');
	try {
		if (!loadedModel) {
			loadedModel = await tf.loadLayersModel('/aiModel/model.json')
			console.log('Layers model succesfully loaded');
		}
	}
	catch(error) {
		console.error('Error loading the model:', error );
	}
	return loadedModel;
}

export async function predictAction() {
	console.log('PredicFunction is called');
	if (!loadedModel) {
		console.error('Model is not loaded yet, skipping prediction');
		return ;
	}
	// console.log(`What is the game state? ${Game.state}`);
	while (Game.state == S.State.Game) {
		// console.log('Am I in the loop?');
		// console.log(`time: ${Game.timeGame}`);
		if (Game.timeGame - lastPredictionTime >= 1000) {
			lastPredictionTime = Game.timeGame;
			// console.log('making prediction');
			const data = collectGameData();

			//convert data into tensor2d
			const inputTensor = tf.tensor2d([data]);
			// console.log('after tensor2d');

			const prediction = loadedModel.predict(inputTensor) as tf.Tensor;
			// console.log('after prediction');

			const predictionResult = await prediction.array();
			// console.log('after predictionArray');

			const predictionArray: number[][] = predictionResult as number[][];
			const output : number[] = predictionArray[0];
			const action = output.indexOf(Math.max(...output));
			console.log(`Predicted action for movement: ${action}`);
			switch (action) {
				case 0:
					movePadel('arrowUp');
					break;
				case 1:
					movePadel('arrowDown');
					break;
				case 2:
					break; //Do we need to change key.pressed to false or anything??
			}
		}
		await tf.nextFrame();
	}
}