import { getMatchBarDB } from '../Database/gamestats.js';
import { visual } from './createGameStats.js';

export async function generateBarChartForMatch(db, matchID) {
	const data = await getMatchBarDB(db, matchID);
	if (!data || data.length === 0) {
		console.log(`No data from getMatchBarDB - matchID: ${matchID}`);
		return `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="${visual.chartWidth}" height="${visual.chartHeight}" viewBox="0 0 ${visual.chartWidth} ${visual.chartHeight}" xmlns="http://www.w3.org/2000/svg">\n<rect x="0" y="0" width="${visual.chartWidth}" height="${visual.chartHeight}" fill="${visual.colors.gr}" />\n<text x="10" y="20" font-size="16" fill="#fff">No data</text>\n</svg>`;
	}

	// CREATE CHART HERE
	console.log(`--- generateBarChartForMatch --- ${matchID}`);
	console.table(data);

	let bars = '';
	const goals = data.length;
	const maxHits = Math.max(1, ...data.map(row => Number(row.hits) || 0));
	const innerWidth = visual.chartWidth - visual.margin.left - visual.margin.right;
	const innerHeight = visual.chartHeight - visual.margin.top - visual.margin.bottom;
	console.log(innerWidth, 'and' , innerHeight);
	data.forEach((row, index) => {
		const hits = Number(row.hits) || 0;
		const h = hits * innerHeight / maxHits;
		const w = innerWidth / goals;
		const x = visual.margin.left + (index * w);
		const y = visual.margin.top + (innerHeight - h);
		const c = index % 2 === 0 ? visual.colors.or : visual.colors.ye;

		bars += `<rect x='${x}' y='${y}' height='${h}' width='${w}' fill='${c}' stroke='black' stroke-width='2'/>`;
	});

	const background = `<rect x="0" y="0" width="${visual.chartWidth}" height="${visual.chartHeight}" fill="${visual.colors.gr}" />`;
	const title = `<text x="10" y="20" font-size="16" fill="${visual.colors.wh}">Hits per goal</text>`
	const axisY = `<line x1="${visual.margin.left}" y1="${visual.margin.top}" x2="${visual.margin.left}" y2="${visual.chartHeight - visual.margin.bottom}" stroke="${visual.colors.bl}" stroke-width="2"/>`;
	const axisX = `<line x1="${visual.margin.left}" y1="${visual.chartHeight - visual.margin.bottom}" x2="${visual.chartWidth - visual.margin.right}" y2="${visual.chartHeight - visual.margin.bottom}" stroke="${visual.colors.bl}" stroke-width="2"/>`;
	const xAsisLabel = `<text x="${visual.chartWidth / 2}" y="${visual.chartHeight - 10}" font-size="12" fill="black" text-anchor="middle">Goals</text>`;
	const yAsisLabel = `<text x="20" y="${visual.chartHeight / 2}" font-size="12" fill="${visual.colors.wh}" text-anchor="middle" transform="rotate(-90, 20, ${visual.chartHeight / 2})">Hits</text>`;
	
	let svg = `<?xml version="1.0" encoding="UTF-8"?>
		<svg width="${visual.chartWidth}" height="${visual.chartHeight}" viewBox="0 0 ${visual.chartWidth} ${visual.chartHeight}" xmlns="http://www.w3.org/2000/svg">
			${background}
			${axisY}
			${axisX}
			${bars}
			${title}
			${xAsisLabel}
			${yAsisLabel}
		</svg>`;

	return (svg);
}
