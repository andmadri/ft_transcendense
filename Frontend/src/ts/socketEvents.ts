import { actionLogin } from './Auth/userAuth.js';
import { actionGame } from './Game/gameStateSync.js'
import { actionOnline } from './Menu/online.js'
import { log } from './logging.js' 
import { Game } from './script.js'

export function startSocketListeners() {
	Game.socket.addEventListener('open', openSocket);
	Game.socket.addEventListener('error', errorSocket);
	Game.socket.addEventListener('message', receiveFromWS);
	Game.socket.addEventListener('close', closeSocket);
}

export function closeSocket(e: CloseEvent) {
	log('WebSocket closes:' + e.code + e.reason);
}

export function openSocket(e: Event) {
	// log('✅ WebSocket is open');
}

export function errorSocket(err: Event) {
	log('⚠️ WebSocket error: ' + err);
}



/*
FROM backend TO frontend
• login => loginCheck / signUpCheck / logout
• playerInfo => getName / getAvatar
• chat => incomming
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
		case 'login':
			actionLogin(data);
			break ;
		case 'playerInfo':
			break ;
		case 'online':
			actionOnline(data);
			break ;
		case 'friends':
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
