export enum State {
	Menu,
	Login,
	Login2,
	Pending,
	Game
}

export enum OT {
	Empty,
	ONEvsONE,
	ONEvsCOM,
	Online
}

export enum MF {
	Empty,
	SingleGame,
	Tournament
}

// GAME
export type gameInfo = {
	state: State,
	opponentType: OT;
	matchFormat: MF;
	logDiv: HTMLDivElement;
	socket: WebSocket;

	// Player that is logged in
	id: number;
	name: string;
	player1Login: Boolean;
	score: number;

	// if there is another player on the same computer (1 vs 1 mode)
	id2: number;
	name2: string;
	player2Login: Boolean;
	score2: number;

	playerLogin: number; // if online => player one or two (so left or right field)
	timeGame: number;
	scoreLeft: number;
	scoreRight: number;
}

// KEYS
type Key = {
	pressed: boolean;
	dir: number;
}

export const Keys: {[key: string]: Key} = {
	"ArrowUp": 		{pressed: false, dir: -1},
	"ArrowDown": 	{pressed: false, dir: 1},
	"w": 			{pressed: false, dir: -1},
	"s": 			{pressed: false, dir: 1}
};

// OBJECTS
type Object = {
	angle: number;
	speed: number;
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}

// type GameState = {
// 	ball : { x : number, y : number, vx : number, vy : number },
// 	lPlayer : { x : number, y : number, vy : number },
// 	rPlayer : { x : number, y : number, vy : number },
// 	score : { left : number, right : number }
// }

// export const unitGamePos : GameState = {
// 	ball : { x : 0.5, y : 0.5, vx : 0, vy : 0 },
// 	lPlayer : { x : 0.02, y : 0.5, vy : 0 },
// 	rPlayer : { x: 0.98, y : 0.5, vy : 0 },
// 	score : { left : 0, right : 0 }
// }

// export const gamePos : GameState = {
// 	ball : { x : 0.5, y : 0.5, vx : 0, vy : 0 },
// 	lPlayer : { x : 0, y : 0.5, vy : 0 },
// 	rPlayer : { x: 0, y : 0.5, vy : 0 },
// 	score : { left : 0, right : 0 }
// }

// type gameSizes = {
// 	field : { width : number, height : number }
// 	ball : { radius : number, speed : number}
// 	paddle : { height : number, width : number, speed: number}
// }

// export const unitGameSizes : gameSizes = {
// 	field : { width : 1, height : 0.7 },
// 	ball : { radius : 0.025, speed: 0.015 },
// 	paddle : { height : 0.3, width : 0.02, speed: 0.03 }
// }

// export const gameScreenPixels : gameSizes = {
// 	field : { width : 1, height : 0.7 },
// 	ball : { radius : 0.05, speed: 0.015 },
// 	paddle : { height : 0.3, width : 0.02, speed: 0.03 }
// }

enum Entity {
  ball = 0,
  LPlayer,
  RPlayer,
  field,
  paddle
}

type Components = {
	pos : { x : number, y : number },
	velocity : { vx : number, vy : number },
	size : { width : number, height : number },
	movement : { speed : number, angle : number },
	radius : { r : number }
}

// AI
type AIPrediction = {
	x: number;
	y: number;
	dx: number;
	dy: number;
};

export type AIInfo = {
	prediction: AIPrediction;
	reactionTime: number; // ms
	lastView: number; // timestamp of last view of the game
	targetDirection: 'ArrowUp' | 'ArrowDown' | 'noAction';
};