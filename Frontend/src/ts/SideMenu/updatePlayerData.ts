import { log } from '../logging.js';
import { UI, Game } from "../gameData.js"
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
		Game.match.player1.name = data.name || 'unknown';
		Game.match.player1.ID = data.id || -1;
		Game.match.player1.login = data.player1Login || false;
		Game.match.player1.score = data.score || 0;
		Game.match.player2.name = data.name2 || 'unknown';
		Game.match.player2.ID = data.id2 || -1;
		Game.match.player2.login = data.player2Login || false;
		Game.match.player2.score = data.score2 || 0;
	}
	if (Game.match.player1.ID != -1)
		UI.state = S.stateUI.Menu;
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