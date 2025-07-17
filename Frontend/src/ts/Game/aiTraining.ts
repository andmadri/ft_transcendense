import * as S from '../structs.js'
import { Game } from '../script.js'

interface trainingData {
	gameTime: number;
	ballX: number;
	ballY: number;
	ballDX: number;
	ballDY: number;
	paddleY: number;
	opponentY: number;
	action: 'arrowUp' | 'arrowDown' | 'none';
}

export const trainingSet: trainingData[] = [];

function getCurrentAction(): 'arrowUp' | 'arrowDown' | 'none' {
	if (S.Keys['w'].pressed) {
		return 'arrowUp';
	}
	if (S.Keys['s'].pressed) {
		return 'arrowDown';
	}
	return 'none';
}

//Only tracking right player actions for now, so only tracking W | S keys
export function collectTrainingData(): trainingData | null {
	const fieldWidth = S.Objects['field'].width;
	const fieldHeight = S.Objects['field'].height;
	const ball = S.Objects['ball'];
	const player = S.Objects['rPlayer'];
	const opponent = S.Objects['lPlayer'];

	//divide by width / height so data is normalized (relative to field size)
	return {
		gameTime: Game.timeGame,
		ballX: ball.x / fieldWidth,
		ballY: ball.y / fieldHeight,
		ballDX: (Math.cos(ball.angle) * ball.speed) / fieldWidth,
		ballDY: (Math.sin(ball.angle) * ball.speed) / fieldHeight,
		paddleY: player.y / fieldHeight,
		opponentY: opponent.y / fieldHeight,
		action: getCurrentAction(),
	}
}

export function downloadTrainingData() {
	const blob = new Blob([JSON.stringify(trainingSet, null, 2)], { 
		type: 'application/json' });
	
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `training-data-${Date.now()}.json`
	a.click();
	URL.revokeObjectURL(url);
}