import * as S from '../structs.js'
import { Game, UI } from "../gameData.js"
import { log } from '../logging.js'
import { OT, state } from '@shared/enums'
import { renderGameInterpolated, makeSnapshot } from './renderSnapshots.js';

export function applyGameStateUpdate(data : any) {
	console.log(`applyGameStateUpdate() state: ${data.state}`);
	if (Game.match.mode == OT.Online) {
		const playerNr = Game.match.player1.ID == UI.user1.ID ? 1 : 2;
		if (data.gameState) {
			makeSnapshot(data.gameState, playerNr);
		}
		else {
			console.log("Data is missing in applyUpdatesGameServer");
		}
	}
}

export function applyScoreUpdate(data: any) {
	console.log(`applyScoreUpdate`);
	if (Game.match.mode == OT.Online) {
		Game.match.state = data.match.state;
		Game.match.gameState = data.match.gameState;
		Game.match.lastScoreID = data.match.lastScoreID;
		Game.match.player1.score = data.match.player1.score;
		Game.match.player2.score = data.match.player2.score;
	}
}

export function sendKeyPressUpdate(key : string) {
	Game.socket.emit('message',{
		action: 'game',
		subaction: 'keyPressUpdate',
		key: key,
		pressed: S.Keys[key].pressed,
		id: UI.user1.ID,
		matchID: Game.match.matchID
	});
}

export function sendGameState() {
	Game.socket.emit('message',{
		action: 'game',
		subaction: 'gameStateUpdate',
		matchID: Game.match.matchID,
		gameState: Game.match.gameState
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
