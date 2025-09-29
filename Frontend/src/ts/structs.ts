import { matchInfo } from '@shared/types'

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

export enum pendingState {
	Online,
	Friend
}

export enum AIbehavior {
	wrongDir,
	hesitate,
	normal
}

export type update = {
	time: number;
	player: [number, boolean, boolean];
	ball: [number, number, number, number];
}

export type user = {
	ID: number,
	name: string,
	Twofa: boolean,
	Google: boolean
}

export type UI = {
	state: stateUI,
	logDiv: HTMLDivElement,
	user1: user,
	user2: user
}

export type Game = {
	socket: Socket,
	pendingState: pendingState,
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
	x: number,
	y: number,
	errorMargin : number
};

export type AIInfo = {
	prediction: AIPrediction,
	reactionTime: number, // ms
	lastView: number // timestamp of last view of the game
};

//export const host = window.location.host;
export const host = window.location.host;