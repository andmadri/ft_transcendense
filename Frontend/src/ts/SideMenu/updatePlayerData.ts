import { UI, Game } from "../gameData.js"
import { navigateTo, getValidState } from '../history.js';
import { customAlert } from '../Alerts/customAlert.js';



export function actionPlayerInfo(data: any) {
	if (!data.subaction) {
		console.error('No subaction in playerInfo data');
		return;
	} else if (data.subaction === 'receivePlayerData') {
		receivePlayerData(data);
	} else if (data.subaction == 'changeName') {
		updateUsername(data);
	} else {
		console.log(`Unknown subaction in playerInfo: ${data.subaction}`);
	}
}

function updateUsername(msg: any) {
	if (msg.success === 1) {
		customAlert('Username is successfully changed'); //needed customAlert
		UI.user1.name = msg.msg;
		const playerNameField = document.getElementById('userNameMenu1')
		if (playerNameField)
			playerNameField.textContent = msg.msg;

	} else {
		if (msg.msg)
			customAlert("Unable to change username"); //needed customAlert
	}
}

function receivePlayerData(data: any) {
	if (!data || !data.success != true) {
		console.error('Error receiving player data:', data.msg);
		return;
	} else {
		UI.user1.name = data.name || 'unknown';
		UI.user1.ID = data.id || -1;
		Game.match.player1.score = data.score || 0;
		UI.user2.name = data.name2 || 'Guest';
		UI.user2.ID = data.id2 || -1;
		Game.match.player2.score = data.score2 || 0;
	}
	// if (UI.user1.ID != -1) {

	// 	// Check where to go and if there is a page in the history (refresh)
	// 	const historyPage = sessionStorage.getItem('history');

	// 	if (historyPage) {
	// 		const validPage = getValidState(historyPage);

	// 		navigateTo(validPage);
	// 	} else {
	// 		navigateTo('Menu');
	// 	}
	// }

	// const body = document.getElementById('body');
	// if (!body) return ;
	// const menu = document.createElement('div');
	// if (!menu) return ;
}

export function getPlayerData() {
	Game.socket.emit('message', {
		action: 'playerInfo',
		subaction: 'getPlayerData'
	});
}

export function updatePlayerData(player: number) {
	if (player != 0) // guest
		getPlayerData();
}