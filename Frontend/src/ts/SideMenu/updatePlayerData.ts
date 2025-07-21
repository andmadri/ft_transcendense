import { log } from '../logging.js';
import { Game } from '../script.js';
import { updateScoreMenu, updateNamesMenu } from './SideMenuContent.js';


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
		Game.name = data.name || 'unknown';
		Game.id = data.id || 0;
		Game.player1Login = data.player1Login || false;
		Game.score = data.score || 0;
		Game.name2 = data.name2 || 'unknown';
		Game.id2 = data.id2 || 0;
		Game.player2Login = data.player2Login || false;
		Game.score2 = data.score2 || 0;
	}
	const app = document.getElementById('app');
	if (!app) return ;
	const menu = document.createElement('div');
	if (!menu) return ;
	// menu.append(getPlayer(1), getPlayer(2));
	// app.appendChild(menu);
	updateScoreMenu(); 
	updateNamesMenu();
}

export function getPlayerData() {
	const msg = {action: 'playerInfo', subaction: 'getPlayerData'};
	Game.socket.send(JSON.stringify(msg));
}

export function updatePlayerData() {
	return getPlayerData();
}