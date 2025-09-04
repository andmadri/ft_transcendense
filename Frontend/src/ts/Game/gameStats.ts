import { log } from '../logging.js';

let currentStatsMatchId: number | null = null;

function ensureStatsChartElement(): HTMLImageElement {
	let img = document.getElementById('statsChart') as HTMLImageElement | null;
	if (!img) {
		img = document.createElement('img');
		img.id = 'statsChart';
		img.alt = 'User state durations';
		img.style.maxWidth = '100%';
		img.style.display = 'block';
	}
	return img;
}

export function getGameStats(opts?: { matchId?: number }) {
	log(`See GameStats! of gameID:${Number(opts?.matchId)}`);
	console.log(`See GameStats! of gameID:${Number(opts?.matchId)}`);

	const matchId = Number(opts?.matchId);
	if (!Number.isFinite(matchId) && currentStatsMatchId === matchId) {
		console.warn('getGameStats: no matchId or game stats is already loaded');
		return ;
	}


	// document.getElementById("creditDiv")?.remove();
	// document.getElementById("containerDashboard")?.remove();
	// document.getElementById("settingPage")?.remove();
	// document.getElementById("gameOver")?.remove();

	const body = document.getElementById('body');
	if (!body)
		return ;

	const page = document.createElement('div');
	if (!page)
		return ;
	page.id = 'statsPage';
	page.style.margin = '0';
	page.style.width = '100vw';
	page.style.height = '100vh';
	page.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	page.style.display = 'flex';
	page.style.alignItems = 'flex-start';
	page.style.justifyContent = 'center';
	page.style.padding = '24px';

	const img = ensureStatsChartElement();
	img.onload = () => console.log('Chart loaded', img.naturalWidth, img.naturalHeight);
	img.onerror = (e) => console.warn('Chart failed to load', e);
	img.src = `/api/charts/user-state-durations/${matchId}?t=${Date.now()}`;

	body.appendChild(img);
	page.appendChild(img);
	body.replaceChildren(page);
	// const test_img = ensureStatsChartElement();
	// test_img.src = `/api/charts/user-state-durations/${matchId}?t=${Date.now()}`;
	// body.appendChild();

	currentStatsMatchId = matchId;
}
