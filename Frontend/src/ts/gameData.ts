import { OT, state, MF } from '@shared/enums'
import * as S from './structs.js'

declare const io: any;

export const UI : S.UI = {
	state: S.stateUI.LoginP1,
	logDiv : document.getElementById('log') as HTMLDivElement,
	user1: {
		ID: -1,
		name: 'unknown',
		Twofa: false
	},
	user2: {
		ID: 1,
		name: 'Guest',
		Twofa: false
	},
}

export function newMatch() {
	return ({
		state: state.Pending,
		matchID: -1,
		matchFormat: MF.Empty,
		pauseTimeOutID: null,
		resumeTime: -1,
		lastUpdateTime: -1,
		mode: OT.Empty,
		lastScoreID: -1,
		lastUpdateTime: null,
		player1: {
			ID: -1,
			name: 'unknown',
			ready: false,
			input: { pressUP: false, pressDOWN: false },
			score: 0,
		},
		player2: {
			ID: 1,
			name: 'Guest',
			ready: false,
			input: { pressUP: false, pressDOWN: false },
			score: 0,
		},
		gameState: {
			time: 0,
			field: { size: {width: 1, height: 0.75}},
			ball: { 
				size: { width: 0.05, height: 0.05 },
				pos: { x: 0.5, y: 0.75 / 2 },
				velocity: { vx: 0, vy: 0 },
				movement: { speed: 0.5 },
				},
			paddle1: { 
				size: { width: 0.02, height: 0.14},
				pos: { x: 0.02, y: (0.75 / 2) },
				velocity: { vx: 0, vy: 0 },
				movement: { speed: 0.6 },
				},
			paddle2: { 
				size: { width: 0.02, height: 0.14 },
				pos: { x: 0.98, y: (0.75 / 2) },
				velocity: { vx: 0, vy: 0 },
				movement: { speed: 0.6 },
				},
		}
	});
}

export const Game : S.Game = { 
	socket: io(`https://${window.location.host}`, {
		path: '/socket.io/', 
		transports: ['websocket'],
		secure: true,
	}),
	match: newMatch(),
	colletedSteps: [], //not used i think
}