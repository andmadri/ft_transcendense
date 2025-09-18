import { getMatchBarDB } from '../Database/gamestats.js';
import { createSvgCanvas, createPlotArea, drawFrame } from '../Charts/charts.js';
import { drawTitle, drawXAxisTitle, drawYAxisTitle } from '../Charts/titles.js';
import { linearScale } from '../Charts/scales.js';
import { drawXAxisTicks, drawYAxisTicks } from '../Charts/ticks.js';

function renderBars(data, yScale, colorOf) {
	let bars = '';
	const goals = data.length;

	data.forEach((row, index) => {
		const hits = Number(row.hits) || 0;
		const w = 896 / goals;
		const x = 80 + (index * w);
		const y = yScale(hits);
		const h = yScale(0) - y;
		const c = colorOf.get(row.username) || '#ffffff';
		bars += `<rect x='${x}' y='${y}' height='${h}' width='${w * 0.9}' fill='${c}' rx="6" ry="6"/>`;
	});
	return `<g class="bars">${bars}</g>`;
}

export async function generateBarChartForMatch(db, matchID, colorOf) {
	const data = await getMatchBarDB(db, matchID);
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// SET VALUES
	const min_x = 0;
	const min_y = 0;
	const max_x = data.length;
	const max_y = Math.max(1, ...data.map(row => Number(row.hits) || 0));
	const ticks_x = data.length + 1;
	const ticks_y = max_y + 1;

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });
	const frame = drawFrame(plot);

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `HITS PER GOAL`);
	const xTitle = drawXAxisTitle(plot, 'GOAL');
	const yTitle = drawYAxisTitle(plot, 'NUMBER OF HITS');

	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x, false, false, 0);
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y, true);

	// DATA
	const yScale = linearScale(min_y, max_y, plot.y + plot.height, plot.y + 1);
	const bars = renderBars(data, yScale, colorOf);

	return (open + chartTitle + frame + xTitle + yTitle + xTicks + yTicks + bars + close);
}
