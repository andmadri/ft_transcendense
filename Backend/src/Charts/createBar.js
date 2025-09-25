import { getMatchBarDB } from '../Database/gamestats.js';
import { createSvgCanvas, createPlotArea, drawFrame } from './charts.js';
import { drawTitle, drawXAxisTitle, drawYAxisTitle } from './titles.js';
import { linearScale } from './scales.js';
import { drawXAxisTicks, drawYAxisTicks } from './ticks.js';

function renderBars(data, yScale, colorOf) {
	let bars = '';
	const goals = data.length;

	data.forEach((row, index) => {
		const hits = Number(row.hits) || 0;
		const w = 896 / goals;
		const x = 80 + (index * w);
		const y = yScale(hits);
		const h = yScale(0) - y;
		const c = colorOf.get(row.user_id) || '#ffffff';
		bars += `<rect x='${x + (w * 0.05)}' y='${y}' height='${h}' width='${w * 0.90}' fill='${c}' rx="6" ry="6"/>`;
	});
	return `<g class="bars">${bars}</g>`;
}

export async function generateBarChartForMatch(db, matchID, colorOf) {
	const { width, height, open, close } = createSvgCanvas();
	let data = null;
	try {
		data = await getMatchBarDB(db, matchID);
		if (!data || data.length === 0) {
			return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
		}
	} catch (err) {
		console.log('Database error: ', err);
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// SET VALUES
	const min_x = 0;
	const min_y = 0;
	const max_x = data.length;
	const max_y = Math.max(1, ...data.map(row => Number(row.hits) || 0));
	const ticks_x = data.length + 1;
	const ticks_y = Math.min(11, max_y + 1);
	const decimals = (ticks_y < 11) ? 0 : 1;

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });
	const frame = drawFrame(plot);

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `HITS PER GOAL`);
	const xTitle = drawXAxisTitle(plot, 'GOAL');
	const yTitle = drawYAxisTitle(plot, 'NUMBER OF HITS');

	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x, false, false, 0);
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y, true, true, decimals);

	// DATA
	const yScale = linearScale(min_y, max_y, plot.y + plot.height, plot.y + 1);
	const bars = renderBars(data, yScale, colorOf);

	return (open + chartTitle + frame + xTitle + yTitle + xTicks + yTicks + bars + close);
}
