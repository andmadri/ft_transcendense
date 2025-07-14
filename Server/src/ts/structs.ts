// GAME
export type gameInfo = {
	loggedIn: boolean;
	gameOn: boolean;
	opponentType: string;
	matchFormat: string;
	logDiv: HTMLDivElement;
	socket: WebSocket;
	timeAi: number;
	timeGame: number;
	targetDirectionAi: string;
}

// KEYS
type Key = {
	pressed: boolean;
	dir: number;
}

export const Keys: {[key: string]: Key} = {
	"ArrowUp": 		{pressed: false, dir: -10},
	"ArrowDown": 	{pressed: false, dir: 10},
	"w": 			{pressed: false, dir: -10},
	"s": 			{pressed: false, dir: 10}
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
	"ball":	{angle: 0.33, speed: 10, x: 0, y: 0, width: 0, height: 0, color: "white"},
	"rPlayer": {angle: 0, speed: 10, x: 0, y: 0, width: 0, height: 0, color: "green"},
	"lPlayer": {angle: 0, speed: 10, x: 0, y: 0, width: 0, height: 0, color: "yellow"},
	"field": {angle: 0, speed: 0, x: 0, y: 0, width: 0, height: 0, color: "black"}
}
