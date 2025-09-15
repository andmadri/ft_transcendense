import { state, OT, MF  } from '@shared/enums'
import { matchInfo, gameState } from '@shared/types'

type Socket = any;

export enum stateUI {
	Menu,
	LoginP1,
	OptionMenu,
	LoginP2,
	Game,
	GameOver,
	GameStats,
	Tournament,
	Dashboard,
	OpponentMenu,
	Credits,
}

export type update = {
	time: number;
	player: [number, boolean, boolean];
	ball: [number, number, number, number];
}

export type user = {
	ID: number,
	name: string,
	Twofa: boolean
}

export type UI = {
	state: stateUI,
	logDiv: HTMLDivElement,
	user1: user,
	user2: user
}

export type Game = {
	socket: Socket,
	match: matchInfo,
	colletedSteps: [],
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
	tick: number;
};

//export const host = window.location.host;
export const host = window.location.host;