import { Game } from './script.js'

// Create div element for logging
export function createLog() {
	const	body = document.getElementById("body");
	const	logDiv = document.createElement('div');

	logDiv.id = 'log';
	logDiv.style.display= 'flex';
	logDiv.style.position = 'fixed';
	logDiv.style.alignItems = 'center';
	logDiv.style.zIndex = '9999';
	body?.appendChild(logDiv);
}

// print msg in element on top (zIndex)
export function log(msg: string) {
	Game.logDiv.innerHTML = '';
	const p = document.createElement('p');
	p.textContent = msg;
	Game.logDiv.appendChild(p);
	console.log(msg);
}