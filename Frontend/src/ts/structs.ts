type Socket = any;

export enum State {
	LoginP1,
	Menu,
	OptionMenu,
	LoginP2,
	Pending,
	Init,
	Game,
	Dashboard,
	End
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

export type update = {
	time: number;
	player: [number, boolean, boolean];
	ball: [number, number, number, number];
}

// GAME
export type gameInfo = {
	state: State,
	opponentType: OT;
	matchFormat: MF;
	logDiv: HTMLDivElement;
	socket: Socket;
	playMode: boolean;
	searchMatch: boolean;

	matchID: number;

	// Information for playercard one
	player1Id: number;
	player1Name: string;
	player1Login: Boolean;

	// Information for playercard two
	player2Id: number;
	player2Name: string;
	player2Login: Boolean;

	playerLogin: number; // if online => player one or two (so left or right field)
	timeGame: number;
	scoreLeft: number;
	scoreRight: number;

	colletedSteps: update[];
	ballPaused: boolean;
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
export type Score = { left : number, right : number};


export const pos : Record<E, Pos> = {
	[E.field] : { x : 0, y : 0},
	[E.ball] : { x : 0.5, y : 0.5},
	[E.lPlayer] : { x : 0.02, y : 0.5},
	[E.rPlayer] : { x : 0.98, y : 0.5}
}

export const movement : Record<E, Movement> = {
	[E.field] : { speed : 0, angle : 0},
	[E.ball] : { speed : 0.015, angle : 0},
	[E.lPlayer] : { speed : 0.025, angle : 0},
	[E.rPlayer] : { speed : 0.025, angle : 0}
}

export const size : Record<E, Size> = {
	[E.field] : { width : 1, height : 0.7},
	[E.ball] : { width : 0.05, height : 0.05 },
	[E.lPlayer] : { width : 0.02, height : 0.3 },
	[E.rPlayer] : { width : 0.02, height : 0.3 }
}

//this will move to the backend
// export const unitMovement : Record<E, Movement> = {
// 	[E.field] : { speed : 0, angle : 0},
// 	[E.ball] : { speed : 0.015, angle : 0},
// 	[E.lPlayer] : { speed : 0.025, angle : 0},
// 	[E.rPlayer] : { speed : 0.025, angle : 0},
// }

// export const unitSize : Record<E, Size> = {
// 	[E.field] : { width : 1, height : 0.7},
// 	[E.ball] : { width : 0.05, height : 0.05 },
// 	[E.lPlayer] : { width : 0.02, height : 0.3 },
// 	[E.rPlayer] : { width : 0.02, height : 0.3 }
// };

// export const unitPos : Record<E, Pos> = {
// 	[E.field] : { x : 0, y : 0},
// 	[E.ball] : { x : 0.5, y : 0.5},
// 	[E.lPlayer] : { x : 0.02, y : 0.5},
// 	[E.rPlayer] : { x : 0.98, y : 0.5}
// }

export const velocity : Record<E, Velocity> = {
	[E.field] : { vx : 0, vy : 0},
	[E.ball] : { vx : 0, vy : 0},
	[E.lPlayer] : { vx : 0, vy : 0},
	[E.rPlayer] : { vx : 0, vy : 0}
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


type gameState = {
	field : {
		size : Size
	}
	lPlayer : {
		pos : Pos,
		movement : Movement,
		velocity : Velocity
	}
	rPlayer : {
		pos : Pos,
		movement : Movement,
		velocity : Velocity
	}
	paddle : {
		size : Size
	}
	ball : {
		size : Size,
		pos : Pos,
		movement : Movement,
		velocity : Velocity
	}
score : {
		left : number,
		right : number
	}
};

//export const host = window.location.hostname;
export const host = window.location.host;
