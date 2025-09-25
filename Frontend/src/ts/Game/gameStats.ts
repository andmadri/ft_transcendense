import { navigateTo } from '../history.js';
import { Game } from '../gameData.js'

export function askForGamestats(matchID: number) {
	Game.socket.emit('message', {
		action: 'gameStats',
		matchID: matchID
	});
}

function ensureStatsChartElement(id: string, alt: string): HTMLImageElement {
	let img = document.getElementById(id) as HTMLImageElement | null;
	if (!img) {
		img = document.createElement('img');
		img.id = id;
		img.alt = alt;
		img.style.maxWidth = '100%';
		img.style.maxHeight = '100%';
		img.style.objectFit = 'contain';
		img.style.borderRadius = '10px';
	}
	return img;
}

function getColumsGameStates(img: HTMLImageElement | SVGSVGElement, img2: HTMLImageElement): HTMLDivElement {
	const column = document.createElement('div');
	column.style.flex = '1 1 50%';
	column.style.display = 'flex';
	column.style.flexDirection = 'column';
	column.style.gap = '12px';
	column.style.padding = '12px';
	column.style.boxSizing = 'border-box';

	for (let i = 0; i < 2; i++) {
		const box = document.createElement('div');
		box.style.flex = '1';
		box.style.display = 'flex';
		box.style.alignItems = 'center';
		box.style.justifyContent = 'center';
		box.style.minHeight = '200px';

		if (i === 0 && img)
			box.appendChild(img);
		else if (i === 1)
			box.appendChild(img2);

		column.appendChild(box);
	}
	return column;
}

function getSRCfromString(chartText: string ): string {
	const svg = chartText;
	const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
	return dataUri;
}

export async function getGameStats(data: any) {
	if (!data.matchID)
		return console.error('GAME_STATS_ERROR', 'No matchID', 'getGameStats');

	console.log(`See GameStats! of gameID:${data.matchID}`);

	const body = document.getElementById('body');
	if (!body) return;

	const page = document.createElement('div');
	page.id = 'statsPage';
	page.style.margin = '0';
	page.style.width = '100vw';
	page.style.height = '100vh';
	page.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	page.style.display = 'flex';
	page.style.flexWrap = 'wrap';
	page.style.alignItems = 'stretch';

	// Charts
	const img1 = ensureStatsChartElement('statsChart1', 'Info match');
	if (data.infoChartSVG)
		img1.src = getSRCfromString(data.infoChartSVG);
	const img2 = ensureStatsChartElement('statsChart2', 'Amount hits per goal');
	if (data.barChartSVG)
		img2.src = getSRCfromString(data.barChartSVG);
	const img3 = ensureStatsChartElement('statsChart3', 'Line chart');
	if (data.scatterChartSVG)
	img3.src = getSRCfromString(data.scatterChartSVG);
	const img4 = ensureStatsChartElement('statsChart4', 'Scatter chart');
	if (data.lineChartSVG)
		img4.src = getSRCfromString(data.lineChartSVG);

	// Exit button
	const exitButton = document.createElement('button');
	exitButton.id = 'exitButton';
	exitButton.textContent = 'X';
	exitButton.style.color = 'black';
	exitButton.style.position = 'absolute';
	exitButton.style.top = '1rem';
	exitButton.style.right = '1rem';
	exitButton.style.background = 'transparent';
	exitButton.style.border = 'transparent';
	exitButton.style.fontSize = 'clamp(10px, 2vw, 30px)';
	exitButton.style.fontFamily = '"Horizon", sans-serif';

	exitButton.addEventListener('click', () => {
		navigateTo('Menu');
	});

	page.appendChild(getColumsGameStates(img1, img2));
	page.appendChild(getColumsGameStates(img3, img4));
	page.appendChild(exitButton);
	body.innerHTML = "";
	body.appendChild(page);
}
