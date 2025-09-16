import { getMatchBarDB } from '../Database/gamestats.js';
import { visual } from './createGameStats.js';

export async function generateBarChartForMatch(db, matchID) {
	const data = await getMatchBarDB(db, matchID);
	if (!data) {
		console.log(`No data from getMatchBarDB - matchID: ${matchID}`);
		return ;
	}

	// CREATE CHART HERE
	console.log(`--- generateBarChartForMatch --- ${matchID}`);
	console.table(data);

	let bars = '';
	const goals = data.length;
	const maxHits = Math.max(...data.map(row => row.hits));

	data.forEach((row, index) => {
		const h = row.hits * visual.chartHeight / maxHits;
		const w = visual.chartWidth / goals;
		const x = index * w;
		const y = visual.chartHeight - h;
		const c = index % 2 === 0 ? visual.colors.or : visual.colors.ye;

		bars += `<rect x='${x}' y='${y}' height='${h}' width='${w}' fill='${c}' />`;
	});

	const background = `<rect x="0" y="0" width="${visual.chartWidth}" height="${visual.chartHeight}" fill="${visual.colors.gr}" />`;
	const title = `<text x="10" y="20" font-size="16" fill="#fff">Hits per goal</text>`

	let svg = `
		<?xml version="1.1" encoding="UTF-8"?>
		<svg width="${visual.chartWidth}" height="${visual.chartHeight}" viewBox="0 0 ${visual.chartWidth} ${visual.chartHeight}" xmlns="http://www.w3.org/2000/svg">
			${background}
			${bars}
			${title}
		</svg>
	`;

	return (svg);
}
