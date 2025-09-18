import { navigateTo } from '../history.js';

// let currentStatsMatchId: number | null = null;

function ensureStatsChartElement(id: string, alt: string): HTMLImageElement {
	let img = document.getElementById(id) as HTMLImageElement | null;
	if (!img) {
		img = document.createElement('img');
		img.id = id;
		img.alt = alt;
		img.style.maxWidth = '100%';
		img.style.display = 'flex';
		img.style.borderRadius = '10px';
	}
	return img;
}

function getColumsGameStates(img: HTMLImageElement | SVGSVGElement, img2: HTMLImageElement): HTMLDivElement {
	const column = document.createElement('div');
	column.style.flex = '0 1 48%'; 
	column.style.display = 'flex';
	column.style.flexDirection = 'column';
	column.style.gap = '12px';
	column.style.padding = '12px';
	column.style.alignItems = 'center';
	column.style.boxSizing = 'border-box';
	column.style.marginTop = '20px';

	for (let i = 0; i < 2; i++) {
		const box = document.createElement('div');
		box.style.height = '500px';
		box.style.width = '100%';
		box.style.display = 'flex';
		box.style.alignItems = 'center';
		box.style.justifyContent = 'center';
		if (i == 0 && img)
			box.appendChild(img);
		else if (i == 1)
			box.appendChild(img2);
		column.appendChild(box);
	}
	return column;
}

async function fetchImg(chart: string , matchId: number): Promise<string> {
	try {
		const response = await fetch(`/api/charts/${chart}/${matchId}?t=${Date.now()}`);
		if (!response.ok)
			throw new Error("Bad response");
		else {
			const svg = await response.text();
			const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
			return (dataUri);
		}
	} catch (err) {
		alert("Network error during fetching img");
		return ('');
	}
}

export async function getGameStats(matchId: number) {
	console.log(`See GameStats! of gameID:${matchId}`);

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
	page.style.flexDirection = 'row';
	page.style.alignItems = 'flex-start';
	page.style.justifyContent = 'flex-start';
	page.style.alignItems = 'center';

	// INFO CHART
	const img1 = ensureStatsChartElement('statsChart1', 'Info match');
	img1.onload = () => console.log('Chart loaded', img1.naturalWidth, img1.naturalHeight);
	img1.onerror = (e) => console.warn('Chart failed to load', e);
	img1.src = await fetchImg('info_chart', matchId);
	img1.style.display = 'block';

	// BAR CHART
	const img2 = ensureStatsChartElement('statsChart2', 'Amount hits per goal');
	img2.onload = () => console.log('Chart loaded', img2.naturalWidth, img2.naturalHeight);
	img2.onerror = (e) => console.warn('Chart failed to load', e);
	img2.src = await fetchImg('bar_chart', matchId);
	img2.style.display = 'block';

	// LINE CHART
	const img3 = ensureStatsChartElement('statsChart3', 'Line chart');
	img3.onload = () => console.log('Chart loaded', img3.naturalWidth, img3.naturalHeight);
	img3.onerror = (e) => console.warn('Chart failed to load', e);
	img3.src = await fetchImg('line_chart', matchId);
	img3.style.display = 'block';

	// PLOTTER CHART
	const img4 = ensureStatsChartElement('statsChart4', 'Scatter chart');
	img4.onload = () => console.log('Chart loaded', img4.naturalWidth, img4.naturalHeight);
	img4.onerror = (e) => console.warn('Chart failed to load', e);
	img4.src = await fetchImg('scatter_chart', matchId);
	img4.style.display = 'block';

	const exitButton = document.createElement('button');
	exitButton.id = 'exitButton';
	exitButton.textContent = 'X';
	exitButton.style.color = 'black';
	exitButton.style.fontSize = 'clamp(10px, 1.5vw, 15px)';
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
	body.replaceChildren(page);
}
