import { OT, MF, state} from "./enums.js"

export type pos = { x: number, y: number };
export type velocity = { vx: number, vy: number };
export type movement = { speed: number};
export type size = { width: number, height: number};

export type entity = {
	size: size,
	pos: pos,
	velocity: velocity,
	movement: movement, // don't think we need angle anymore, maybe replace for just speed
}

export type player = {
	ID: number
	name: string,
	ready: boolean,
	input: { //currently not using this anymore
		pressUP: boolean,
		pressDOWN: boolean
	},
	score: number,
}

export type gameState = {
	time: number,
	field: size,
	ball: entity
	paddle1: entity
	paddle2: entity
}

export type matchInfo = {
	state: state,
	matchID: number,
	matchFormat: MF,
	pauseTimeOutID: number | null,
	resumeTime: number,
	winnerID: number | null,
	mode: OT,
	lastScoreID: number,
	lastUpdateTime: number | null,
	player1: player,
	player2: player,
	gameState: gameState
}
