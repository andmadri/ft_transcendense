export const d = {
	time: 0,
	ID: 1,
	Paddle: 2,
	PressUp: 3,
	PressDown: 4,
	Miss: 5,
	Score: 6,
	BallX: 7,
	BallY: 8,
	BallAngle: 9,
	BallSpeed: 10
}

export const GameStats = {
	player1: {
		id: 0,
		name: '',
		score: 0,
		paddle: 0, // paddle in %
		pressUp: false,
		pressDown: false
	},
	player2: {
		id: 0,
		name: '',
		score: 0,
		paddle: 0, // paddle in %
		pressUp: false,
		pressDown: false
	},
	ball: {
		angle: 0,
		speed: 10,
		x: 0,
		y: 0
	}
}

export const USERLOGIN_TIMEOUT = 60 // 60 seconds
