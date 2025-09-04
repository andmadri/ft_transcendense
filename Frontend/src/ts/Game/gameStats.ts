import { log } from '../logging.js';

export function getGameStats(opts?: { matchId?: number }) {
	log(`See GameStats! of gameID:${Number(opts?.matchId)}`);
	console.log(`See GameStats! of gameID:${Number(opts?.matchId)}`);

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	body.innerHTML = '';

	// const test_img = ensureStatsChartElement();
	// test_img.src = `/api/charts/user-state-durations/${matchId}?t=${Date.now()}`;
	// body.appendChild();

}
