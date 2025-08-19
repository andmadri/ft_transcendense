import { UI } from "./gameData.js"

// Create div element for logging
export function createLog() {
	const	log = document.getElementById("log");
	const	logDiv = document.createElement('div');

	logDiv.id = 'log';
	logDiv.style.display= 'flex';
	logDiv.style.position = 'fixed';
	logDiv.style.alignItems = 'center';
	logDiv.style.zIndex = '9999';
	// log?.appendChild(logDiv);
}

// print msg in element on top (zIndex)
export function log(msg: string) {
	UI.logDiv.innerHTML = '';
	const p = document.createElement('p');
	p.textContent = msg;
	// Game.logDiv.appendChild(p);
	// console.log(msg);
}