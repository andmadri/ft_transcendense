import { navigateTo } from '../history.js';

// let currentStatsMatchId: number | null = null;

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

export function getGameStats(matchId: number) {
	console.log(`See GameStats! of gameID:${matchId}`);

	// if (!Number.isFinite(matchId) && currentStatsMatchId === matchId) {
	// 	console.warn('getGameStats: no matchId or game stats is already loaded');
	// 	return ;
	// }

	// // Delete old DOM containers
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

	const exitButton = document.createElement('button');
	exitButton.id = 'exitButton';
	exitButton.textContent = 'X';
	exitButton.style.color = 'black';
	exitButton.style.fontSize = 'clamp(10px, 1.5vw, 15px)';
	exitButton.style.position = 'fixed';
	exitButton.style.top = '1rem';
	exitButton.style.right = '1rem';
	exitButton.style.background = 'transparent';
	exitButton.style.border = 'transparent';
	exitButton.style.fontSize = 'clamp(10px, 2vw, 30px)';
	exitButton.style.fontFamily = '"Horizon", sans-serif';

	exitButton.addEventListener('click', () => {
		// const statsPage = document.getElementById('statsPage');
		// if (statsPage) {
		// 	statsPage.remove();
		// }
		navigateTo('Menu');
	});

	page.appendChild(exitButton);
	page.appendChild(img);
	body.replaceChildren(page);

	// currentStatsMatchId = matchId;
}
