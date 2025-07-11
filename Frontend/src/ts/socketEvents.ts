import { processSignUpCheck, processLoginCheck } from './Auth/userAuth.js';
import { processBallUpdate, processPadelUpdate } from './Game/gameLogic.js'
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

export function receiveFromWS(e: MessageEvent) {
	const data = JSON.parse(e.data);
	
	const action = data.action;
	if (!action)
		log('no action');

	switch(action) {
		case 'loginCheck':
			processLoginCheck(data);
			break ;
		case 'signUpCheck':
			processSignUpCheck(data);
			break ;
		case 'ballUpdate':
 			processBallUpdate(data);
			break ;
		case 'padelUpdate':
			processPadelUpdate(data);
			break ;
		default:
			log(`Unknown action: ${action}`);
	}
}