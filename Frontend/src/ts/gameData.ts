import { entity } from '@shared/types'
import { OT, state, MF } from '@shared/enums'
import * as S from './structs.js'

declare const io: any;
type Socket = any;

export const UI : S.UI = {
	state: S.stateUI.LoginP1,
	logDiv : document.getElementById('log') as HTMLDivElement
}

export const Game : S.Game = { 
	socket: io(`https://${window.location.host}`, {
		path: '/socket.io/', 
		transports: ['websocket'],
		secure: true,
	}),
	match: {
		state: state.Pending,
		matchID: -1,
		matchFormat: MF.Empty,
		mode: OT.Empty,
		player1: {
			ID: -1,
			name: 'unknown',
			ready: false,
			login: false,
			input: { pressUP: false, pressDOWN: false },
			score: 0,
			Twofa: false
		},
		player2: {
			ID: -1,
			name: 'unknown',
			ready: false,
			login: false,
			input: { pressUP: false, pressDOWN: false },
			score: 0,
			Twofa: false
		},
		gameState: {
			time: 0,
			field: { size: {width: 1, height: 0.75}},
			ball: { 
				size: { width: 0.05, height: 0.05 },
				pos: { x: 0.5, y: 0.75 / 2 },
				velocity: { vx: 0, vy: 0 },
				movement: { speed: 0.01 },
				},
			paddle1: { 
				size: { width: 0.02, height: 0.14},
				pos: { x: 0.02, y: 0.75 / 2 },
				velocity: { vx: 0, vy: 0 },
				movement: { speed: 0.015 },
				},
			paddle2: { 
				size: { width: 0.02, height: 0.14 },
				pos: { x: 0.98, y: 0.75 / 2 },
				velocity: { vx: 0, vy: 0 },
				movement: { speed: 0.015 },
				},
		}
	},
	colletedSteps: [],
}