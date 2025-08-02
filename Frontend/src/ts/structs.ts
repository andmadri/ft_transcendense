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
}

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

export enum E {
  ball = 'ball',
  lPlayer = 'lPlayer',
  rPlayer = 'rPlayer',
  field = 'field',
}


export type Pos = { x : number, y : number };
export type Velocity = { vx : number, vy : number };
export type Movement = { speed : number, angle : number };
export type Size = { width : number, height : number};


export const pos : Record<E, Pos> = {
	[E.field] : { x : 0, y : 0},
	[E.ball] : { x : 0.5, y : 0.5},
	[E.lPlayer] : { x : 0.02, y : 0.5},
	[E.rPlayer] : { x : 0.98, y : 0.5}
}

export const unitPos : Record<E, Pos> = {
	[E.field] : { x : 0, y : 0},
	[E.ball] : { x : 0.5, y : 0.5},
	[E.lPlayer] : { x : 0.02, y : 0.5},
	[E.rPlayer] : { x : 0.98, y : 0.5}
}

export const velocity : Record<E, Velocity> = {
	[E.field] : { vx : 0, vy : 0},
	[E.ball] : { vx : 0, vy : 0},
	[E.lPlayer] : { vx : 0, vy : 0},
	[E.rPlayer] : { vx : 0, vy : 0}
}

export const movement : Record<E, Movement> = {
	[E.field] : { speed : 0, angle : 0},
	[E.ball] : { speed : 0.02, angle : 0.33},
	[E.lPlayer] : { speed : 0.03, angle : 0},
	[E.rPlayer] : { speed : 0.03, angle : 0}
}

export const unitMovement : Record<E, Movement> = {
	[E.field] : { speed : 0, angle : 0},
	[E.ball] : { speed : 0.02, angle : 0.33},
	[E.lPlayer] : { speed : 0.03, angle : 0},
	[E.rPlayer] : { speed : 0.03, angle : 0},
}

export const size : Record<E, Size> = {
	[E.field] : { width : 1, height : 0.7},
	[E.ball] : { width : 0.05, height : 0.05 },
	[E.lPlayer] : { width : 0.02, height : 0.3 },
	[E.rPlayer] : { width : 0.02, height : 0.3 }
}

export const unitSize : Record<E, Size> = {
	[E.field] : { width : 1, height : 0.7},
	[E.ball] : { width : 0.05, height : 0.05 },
	[E.lPlayer] : { width : 0.02, height : 0.3 },
	[E.rPlayer] : { width : 0.02, height : 0.3 }
};


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