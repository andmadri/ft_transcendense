import { log } from '../logging.js';

export function getGameStats() {
	log("See GameStats!");

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	body.innerHTML = '';

	// body.appendChild();

}
