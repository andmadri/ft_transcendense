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
		const c = colorOf.get(row.user_id);
		bars += `<rect x='${x}' y='${y}' height='${h}' width='${w}' fill='${c}'/>`;
	});
	return `<g class="bars">${bars}</g>`;
}

export async function generateBarChartForMatch(db, matchID, colorOf) {
	const data = await getMatchBarDB(db, matchID);
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		console.log(`No data from getMatchBarDB - matchID: ${matchID}`);
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// CREATE CHART HERE
	console.log(`--- generateBarChartForMatch --- ${matchID}`);
	console.table(data);

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
	const chartTitle = drawTitle({ width, height }, margins, `HITS BETWEEN GOAL · MATCH ${matchID}`);
	const xTitle = drawXAxisTitle(plot, 'GOALS');
	const yTitle = drawYAxisTitle(plot, 'HITS');

	// DATA
	const xScale = linearScale(min_x, max_x, plot.x, plot.x + plot.width - 1);
	const yScale = linearScale(min_y, max_y, plot.y + plot.height, plot.y + 1);
	const bars = renderBars(data, yScale, colorOf);

	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x, false);
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y, true);

	return (open + chartTitle + frame + xTitle + yTitle + bars + xTicks + yTicks + close);
}
