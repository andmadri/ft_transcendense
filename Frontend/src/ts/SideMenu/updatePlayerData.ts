import { log } from '../logging.js';
import { Game } from '../script.js';
import * as S from '../structs.js'


export function actionPlayerInfo(data: any) {
	if (!data.subaction) {
		console.error('No subaction in playerInfo data');
		return ;
	} else if (data.subaction === 'receivePlayerData') {
		receivePlayerData(data);
	} else {
		console.log(`Unknown subaction in playerInfo: ${data.subaction}`);
	}
}

function receivePlayerData(data: any) {
	if (!data || !data.success != true) {
		console.error('Error receiving player data:', data.msg);
		return ;
	} else {
		Game.player1Name = data.name || 'unknown';
		Game.player1Id = data.id || -1;
		Game.player1Login = data.player1Login || false;
		Game.player2Name = data.name2 || 'unknown';
		Game.player2Id = data.id2 || -1;
		Game.player2Login = data.player2Login || false;
		Game.scoreLeft = data.score || 0;
		Game.scoreRight = data.score2 || 0;
	}
	if (Game.player1Id != -1)
		Game.state = S.State.Menu;
	const app = document.getElementById('app');
	if (!app) return ;
	const menu = document.createElement('div');
	if (!menu) return ;
}

export function getPlayerData() {
	Game.socket.send({
		action: 'playerInfo', 
		subaction: 'getPlayerData'});
}

export function updatePlayerData(player: number) {
	if (player != 0) // guest
		getPlayerData();
}