import * as S from '../structs.js';
import { Game, UI } from "../gameData.js";
import { OT, state } from '@shared/enums';
import { renderGameInterpolated, makeSnapshot } from './renderSnapshots.js';
import { reconcilePaddle } from './gameLogic.js';

export function applyGameStateUpdate(data: any) {
	if (Game.match.mode == OT.Online) {
		const playerNr = Game.match.player1.ID == UI.user1.ID ? 1 : 2;
		if (Game.match.state != state.Hit && Game.match.state != state.Serve) {
			Game.match.state = data.state;
		}
		Game.match.resumeTime = data.resumeTime;
		if (data.gameState && Game.match.state == state.Playing || Game.match.state == state.Paused) {
			makeSnapshot(data.gameState, playerNr);
		}
		if (Game.match.state == state.Score) {
			renderGameInterpolated();
		}
		reconcilePaddle(playerNr, data.gameState);
	}
}

export function applyScoreUpdate(data: any) {
	if (Game.match.mode == OT.Online) {
		Game.match.state = data.match.state;
		Game.match.gameState = data.match.gameState;
		Game.match.lastScoreID = data.match.lastScoreID;
		Game.match.resumeTime = data.resumeTime;
		Game.match.player1.score = data.match.player1.score;
		Game.match.player2.score = data.match.player2.score;
	}
}

export function sendKeyPressUpdate(key: string) {
	Game.socket.emit('message',{
		action: 'game',
		subaction: 'keyPressUpdate',
		key: key,
		pressed: S.Keys[key].pressed,
		id: UI.user1.ID,
		matchID: Game.match.matchID
	});
}

export function sendPadelHit() {
	Game.socket.emit('message',{
		action: 'game',
		subaction: 'padelHit',
		matchID: Game.match.matchID,
		gameState: Game.match.gameState
	});
}

export function sendServe() {
	Game.socket.emit('message',{
		action: 'game',
		subaction: 'serve',
		matchID: Game.match.matchID,
		gameState: Game.match.gameState
	});
}

export function sendScoreUpdate() {
	Game.socket.emit('message',{
		action: 'game',
		subaction: 'scoreUpdate',
		player: Game.match.lastScoreID,
		gameState: Game.match.gameState,
		matchID: Game.match.matchID
	});
}

export function applyWinner(data: any) {
	Game.match.winnerID = data.winnerID;
	Game.match.state = data.state;
} 