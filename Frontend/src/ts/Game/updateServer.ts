// import * as S from '../structs.js'
// import { Game } from '../script.js';

// function updateServer() {
// 	const updates = {
// 		action: 'game',
// 		subaction: 'update',
// 		match: Game.matchID,
// 		// id: Game.id,
// 		steps: Game.colletedSteps
// 	}
// 	Game.socket.send(JSON.stringify(updates));
// }

// // interpolate steps and send them when collected 10... collect every 100ms
// export function collectDataForServer() {
// 	const player = S.Objects['lPlayer'];
// 	const ball = S.Objects['ball'];
// 	const time = Date.now();

// 	const data: S.update = {
// 		time: time,
// 		player: [player.y, S.Keys['w'].pressed, S.Keys['s'].pressed],
// 		ball: [ball.x, ball.y, ball.angle, ball.speed],
// 	}
// 	Game.colletedSteps.push(data);
// 	if (Game.colletedSteps.length == 10)
// 	{
// 		updateServer();
// 		Game.colletedSteps = [];
// 	}
// }

// export function receiveUpdateFromServer(data: any) {
// 	// const opponent = Game.id == data.p1[0] ? data.p1 : data.p2;
// 	const opponent = data.p1;

// 	S.Objects['rPlayer'].height = opponent[1];
// 	S.Objects['ball'].x = data.b[0];
// 	S.Objects['ball'].y = data.b[1];
// 	S.Objects['ball'].angle = data.b[2];
// 	S.Objects['ball'].speed = data.b[3];
// 	Game.scoreLeft = data.score[0];
// 	Game.scoreRight = data.score[0];
// }

