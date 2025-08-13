export enum State {
	LoginP1,
	LoginP2,
	TwoFactorP1,
	TwoFactorP2,
	Menu,
	Pending,
	Init,
	Game,
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

// GAME
export type gameInfo = {
	state: State,
	opponentType: OT;
	matchFormat: MF;
	logDiv: HTMLDivElement;
	socket: WebSocket;
	playMode: boolean;

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

export const Objects: {[key: string]: Object} = {
	"ball":	{angle: 0.33, speed: 0, x: 0, y: 0, width: 0, height: 0, color: "white"},
	"rPlayer": {angle: 0, speed: 0, x: 0, y: 0, width: 0, height: 0, color: "green"},
	"lPlayer": {angle: 0, speed: 0, x: 0, y: 0, width: 0, height: 0, color: "yellow"},
	"field": {angle: 0, speed: 0, x: 0, y: 0, width: 0, height: 0, color: "black"}
}

// AI
type AIPrediction = {
	x: number;
	y: number;
	dx: number;
	dy: number;
};

export type AIInfo = {
	prediction: AIPrediction | null;
	reactionTime: number; // ms
	lastReaction: number; // timestamp of last reaction
	targetDirection: string; // 'ArrowUp' or 'ArrowDown'
};

export const host = window.location.hostname;