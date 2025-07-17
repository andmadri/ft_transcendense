// GAME
export type gameInfo = {
	loggedIn: boolean;
	gameOn: boolean;
	opponentType: string;
	matchFormat: string;
	logDiv: HTMLDivElement;
	socket: WebSocket;
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