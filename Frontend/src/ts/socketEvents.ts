import { loginSuccessfull } from './userAuth.js';
import { log } from './script.js' 

export function closeSocket(e: CloseEvent) {
	log('WebSocket closes:' + e.code + e.reason);
}

export function openSocket(e: Event) {
	log('✅ WebSocket is open');
}

export function errorSocket(err: Event) {
	log('⚠️ WebSocket error: ' + err);
}

export function receiveFromWS(e: MessageEvent) {
	const data = JSON.parse(e.data);
	log('Received from server: ' + JSON.stringify(data));
	
	const action = data.action;
	if (!action)
		log("no action");
	else if (action == "loginCheck") {
		log("in action == loginCheck...");
		if (data.access && data.access == "yes")
			loginSuccessfull();
		else
			log(data.reason);
		return ;
	} else if (action == "signUpCheck") {
		log("in action == signUpCheck...");
		if (data.access && data.access == "yes")
			log('signup ok'); // signUpSuccessfull
		else
			log(data.reason);
		return ;		
	} else if (action == "ballUpdate") {
 		if ('ballX' in data) {
			const ball = document.getElementById('ball');
			if (ball && typeof data.ballX === 'number')
				ball.style.left = `${data.ballX}px`;
			if (ball && typeof data.ballY === 'number')
				ball.style.top = `${data.ballY}px`;
		}
	} else if (action == "padelUpdate") {
		if ('rPlayerX' in data) {
			const rPlayer = document.getElementById('p1');
			if (rPlayer && typeof data.playerOneX === 'number')
				rPlayer.style.left = `${data.playerOneX}px`;
			if (rPlayer && typeof data.playerOneY === 'number')
				rPlayer.style.top = `${data.playerOneY}px`;
		}
		if ('lPlayerX' in data) {
			const lPlayer = document.getElementById('p2');
			if (lPlayer && typeof data.playerTwoX === 'number')
				lPlayer.style.left = `${data.playerTwoX}px`;
			if (lPlayer && typeof data.playerTwoY === 'number')
				lPlayer.style.top = `${data.playerTwoY}px`;		
		}
	}
}