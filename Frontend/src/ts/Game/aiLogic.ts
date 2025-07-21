import * as S from '../structs.js'
import { Game } from '../script.js'
import { movePadel } from './gameLogic.js'

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
	while (Game.state == S.State.Game) {
		if (Game.timeGame % 1000 == 0) {
			const data = collectGameData();

			//convert data into tensor2d
			const inputTensor = tf.tensor2d([data]);

			const prediction = model.predict(inputTensor) as tf.Tensor;
			const predictionResult = await prediction.array();
			const predictionArray: number[][] = predictionResult as number[][];
			const output : number[] = predictionArray[0];
			const action = output.indexOf(Math.max(...output));
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
	}
	await tf.nextFrame();
}