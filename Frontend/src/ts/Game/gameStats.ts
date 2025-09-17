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

// Creates a innter element with txt for the gamestats
function getLineSVG(fontSize: number, txt: string, x: number, y: number, color?: string): SVGTextElement {
	const txtElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	txtElement.textContent = txt;
	txtElement.setAttribute('x', `${x}`);
	txtElement.setAttribute('y', `${y}`);
	txtElement.setAttribute('font-size', `${fontSize}px`);
	if (color)
		txtElement.setAttribute('fill', color);
	else
		txtElement.setAttribute('fill', 'white');
	txtElement.style.fontFamily = '"Horizon", sans-serif';
	return (txtElement);
}

// Creates the left upper part with the basic game stats
function getGameStatsSVG(player1: string, player2: string, score1: number, score2: number, time_match: number): SVGSVGElement {
	const svgNamespace = 'http://www.w3.org/2000/svg';

	const gameStatsSVG = document.createElementNS(svgNamespace, 'svg');
	gameStatsSVG.setAttribute('width', '500');
	gameStatsSVG.setAttribute('height', '300');
	gameStatsSVG.setAttribute('viewBox', '0 0 500 300');
 
	const background = document.createElementNS(svgNamespace, 'rect');
	background.setAttribute('x', '0');
	background.setAttribute('y', '0');
	background.setAttribute('width', '500');
	background.setAttribute('height', '300');
	background.setAttribute('rx', '10');
	background.setAttribute('ry', '10');
	background.setAttribute('fill', '#363430');
	gameStatsSVG.appendChild(background);

	gameStatsSVG.appendChild(getLineSVG(20, 'Stats match', 20, 30)); 
	gameStatsSVG.appendChild(getLineSVG(14, `${player1}  |  score: ${score1}`, 20, 90, '#ff6117'));
	gameStatsSVG.appendChild(getLineSVG(14, 'vs', 20, 110));
	gameStatsSVG.appendChild(getLineSVG(14, `${player2}  |  score: ${score2}`, 20, 130, '#ffc433'));
	gameStatsSVG.appendChild(getLineSVG(14, `playing time: ${time_match} min`, 20, 170));
	gameStatsSVG.appendChild(getLineSVG(14, `winner: ${player1}`, 20, 200));
	return (gameStatsSVG);
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
		box.style.height = '300px';
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

export function getGameStats(matchId: number) {
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

	// USERSTATS CHART
	const img = ensureStatsChartElement('statsChart', 'User state durations');
	img.onload = () => console.log('Chart loaded', img.naturalWidth, img.naturalHeight);
	img.onerror = (e) => console.warn('Chart failed to load', e);
	img.src = `/api/charts/user-state-durations/${matchId}?t=${Date.now()}`;
	img.style.display = 'block';

	// BAR CHART
	const img2 = ensureStatsChartElement('statsChart2', 'Amount hits per goal');
	img2.onload = () => console.log('Chart loaded', img2.naturalWidth, img2.naturalHeight);
	img2.onerror = (e) => console.warn('Chart failed to load', e);
	img2.src = `/api/charts/bar_chart/${matchId}?t=${Date.now()}`;
	img2.style.display = 'block';

	// LINE CHART
	const img3 = ensureStatsChartElement('statsChart2', 'Amount hits per goal');
	img3.onload = () => console.log('Chart loaded', img3.naturalWidth, img3.naturalHeight);
	img3.onerror = (e) => console.warn('Chart failed to load', e);
	img3.src = `/api/charts/bar_chart/${matchId}?t=${Date.now()}`;
	img3.style.display = 'block';

	// PLOTTER CHART
	const img4 = ensureStatsChartElement('statsChart2', 'Amount hits per goal');
	img4.onload = () => console.log('Chart loaded', img4.naturalWidth, img4.naturalHeight);
	img4.onerror = (e) => console.warn('Chart failed to load', e);
	img4.src = `/api/charts/bar_chart/${matchId}?t=${Date.now()}`;
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

	page.appendChild(getColumsGameStates(getGameStatsSVG('WWWWWWWWWW', 'Player2', 5, 3, 5), img2));
	page.appendChild(getColumsGameStates(img3, img4));
	page.appendChild(exitButton);
	body.replaceChildren(page);
}
