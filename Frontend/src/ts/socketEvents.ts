import { actionGame } from './Game/game.js'
import { actionOnline } from './Menu/online.js'
import { log } from './logging.js' 
import { Game } from './script.js'
import { getPlayerData, actionPlayerInfo } from './SideMenu/updatePlayerData.js'
import { actionFriends, getFriendsList } from './Menu/friends.js'

export function startSocketListeners() {
	Game.socket.addEventListener('open', openSocket);
	Game.socket.addEventListener('open', () => { getPlayerData(); });
	Game.socket.addEventListener('error', errorSocket);
	Game.socket.addEventListener('message', receiveFromWS);
	Game.socket.addEventListener('close', closeSocket);
}

export function closeSocket(e: CloseEvent) {
	log('WebSocket closes:' + e.code + e.reason);
}

export function openSocket(e: Event) {
	log('✅ WebSocket is open');
}

export function errorSocket(err: Event) {
	log('⚠️ WebSocket error: ' + err);
}

/*
FROM backend TO frontend
• playerInfo => getName / getAvatar / revicePlayerData
• chat => incomming
• friends => retFriends
• online => retOnlinePlayers / retOnlinePlayersWaiting
• friends => retFriends
• pending => getWaitlist / createGame / startGame
• game => ballUpdate / padelUpdate / scoreUpdate
• error => checkError / errorPage?
*/
export function receiveFromWS(e: MessageEvent) {
	const data = JSON.parse(e.data);
	
	const action = data.action;
	if (!action)
		log('no action');

	switch(action) {
		case 'playerInfo':
			actionPlayerInfo(data);
			break ;
		case 'online':
			actionOnline(data);
			break ;
		case 'friends':
			actionFriends(data);
			break ;
		case 'pending':
			break ;
		case 'game':
			actionGame(data);
			break ;
		case 'error':
			if (data.reason)
				log('error' + `${data.reason}`);
			else
				log('data received from ws' + data);
			break ;
		default:
			log(`(receiveFromWS) Unknown action: ${action}`);
	}
}
