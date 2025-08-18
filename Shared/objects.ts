import { OT, MF, Stage} from "./enums.ts"
import { Size, Pos, Velocity, Movement} from "./gameTypes.ts"

export type entity = {
	Size : Size,
	Pos : Pos,
	Velocity : Velocity,
	Movement : Movement, // don't think we need angle anymore, maybe replace for just speed
}

export type player = {
	playerID : number
	name : string,
	ready : boolean,
	input : {
		pressUP : boolean,
		pressDOWN : boolean
	}
	//???score here???
}

export type gameState = {
	timeGame : number,
	field : Size,
	ball : entity
	paddle1: entity
	paddle2 : entity
//  ??score : {
//   player1 : number,
//   player2 : number
//  }??
}

export type matchInfo = {
	matchID : number,
	matchFormat : MF
	mode : OT,
	stage : Stage,
	player1 : player,
	player2 : player,
	gameState : gameState
}
