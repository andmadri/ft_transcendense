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
		ball.x / fieldWidth,
		ball.y / fieldHeight,
		(Math.cos(ball.angle)),
		(Math.sin(ball.angle)),
		player.y / fieldHeight,
		opponent.y / fieldHeight,
	]
}

export async function loadModel() {
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
	while (Game.state == S.State.Game) {
		if (Game.timeGame - lastPredictionTime >= 1000) {
			lastPredictionTime = Game.timeGame;
			const data = collectGameData();

			console.log(`Data collected: [${data}]`);
			const inputTensor = tf.tensor2d([data]);

			const prediction = loadedModel.predict(inputTensor) as tf.Tensor;

			const predictionResult = await prediction.array();

			const predictionArray: number[][] = predictionResult as number[][];
			const output : number[] = predictionArray[0];
			const action = output.indexOf(Math.max(...output));
			console.log(`Raw model output: ${output}`);
			console.log(`Predicted action for movement: ${action}`);
			switch (action) {
				case 0:
					movePadel('ArrowUp');
					break;
				case 1:
					movePadel('ArrowDown');
					break;
				case 2:
					break; //Do we need to change key.pressed to false or anything??
			}
		}
		await tf.nextFrame();
	}
}