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

	// if there is another player on the same computer (1 vs 1 mode)
	id2: number;
	name2: string;
	player2Login: Boolean;

	playerLogin: number; // if online => player one or two (so left or right field)
}

// KEYS
type Key = {
	pressed: boolean;
	dir: number;
}

export const Keys: {[key: string]: Key} = {
	'ArrowUp': 		{pressed: false, dir: -10},
	'ArrowDown': 	{pressed: false, dir: 10},
	'w': 			{pressed: false, dir: -10},
	's': 			{pressed: false, dir: 10}
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

export const Objects: {[key: string]: Object} = {
	'ball':	{angle: 0.33, speed: 10, x: 0, y: 0, width: 0, height: 0, color: 'white'},
	'rPlayer': {angle: 0, speed: 10, x: 0, y: 0, width: 0, height: 0, color: 'green'},
	'lPlayer': {angle: 0, speed: 10, x: 0, y: 0, width: 0, height: 0, color: 'yellow'},
	'field': {angle: 0, speed: 0, x: 0, y: 0, width: 0, height: 0, color: 'black'}
}
