import { UI, Game } from "../gameData.js";
import { customAlert } from '../Alerts/customAlert.js';

export function actionPlayerInfo(data: any) {
	if (!data.subaction) {
		return console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format:', 'subaction missing', 'actionPlayerInfo');
	} else if (data.subaction === 'receivePlayerData') {
		receivePlayerData(data);
	} else if (data.subaction == 'profileSettings') {
		updateProfileSettings(data);
	} else {
		console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format:', data.subaction, 'actionPlayerInfo');
	}
}

function updateProfileSettings(msg: any) {
	if (msg.success === 1) {
		customAlert(`${msg.field} is successfully changed`);
		if (msg.field == 'name') {
			UI.user1.name = msg.msg;
			const playerNameField = document.getElementById('userNameMenu1')
			if (playerNameField)
				playerNameField.textContent = msg.msg;
		}
	} else {
		if (msg.msg)
			customAlert(msg.msg);
	}
}

function receivePlayerData(data: any) {
	if (!data || !data.success != true) {
		return console.error('PLAYER_DATA_ERROR', `Error receiving player data: ${data?.msg || 'No message provided'}`, 'receivePlayerData');
	} else {
		UI.user1.name = data.name || 'unknown';
		UI.user1.ID = data.id || -1;
		Game.match.player1.score = data.score || 0;
		UI.user2.name = data.name2 || 'Guest';
		UI.user2.ID = data.id2 || -1;
		Game.match.player2.score = data.score2 || 0;
		UI.user1.Google = data.google || false
	}
}

export function getPlayerData() {
	Game.socket.emit('message', {
		action: 'playerInfo',
		subaction: 'getPlayerData'
	});
}
