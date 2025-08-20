import { state, OT, MF  } from '@shared/enums'
import { matchInfo, gameState } from '@shared/types'

type Socket = any;

export enum stateUI {
	LoginP1,
	Menu,
	LoginP2,
	Game
}

export type update = {
	time: number;
	player: [number, boolean, boolean];
	ball: [number, number, number, number];
}


export type UI = {
	state: stateUI,
	logDiv: HTMLDivElement,
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
	targetDirection: 'ArrowUp' | 'ArrowDown' | 'noAction';
};

//export const host = window.location.hostname;
export const host = window.location.host;
