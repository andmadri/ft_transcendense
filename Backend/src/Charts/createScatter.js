import { getMatchScatterDB } from '../Database/gamestats.js';
import { createSvgCanvas, createPlotArea, drawFrame } from './charts.js';
import { drawTitle, drawXAxisTitle, drawYAxisTitle } from './titles.js';
import { linearScale } from './scales.js';
import { drawXAxisTicks, drawYAxisTicks } from './ticks.js';

export function renderScatterPoints(data, xScale, yScale, colorOf) {
	const dots = data.map((d) => {
		const x = xScale(d.ball_x);
		const y = yScale(d.ball_y);
		const fill = colorOf.get(d.user_id);

		return `<circle cx="${x}" cy="${y}" r="7" fill="${fill}" stroke="black" stroke-width="1" />`;
	}).join('');

	return `<g class="marks-scatter">${dots}</g>`;
}

export async function generateScatterChartForMatch(db, matchID, colorOf) {
	const { width, height, open, close } = createSvgCanvas();
	let data = null;
	try {
		data = await getMatchScatterDB(db, matchID);
		if (!data || data.length === 0) {
			return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
		}
	} catch (err) {
		console.error('DB_ERROR', `Database error: ${err.message || err}`, 'generateScatterChartForMatch');
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// SET VALUES
	const min_x = 0;
	const min_y = 0;
	const max_x = 1;
	const max_y = 1;
	const ticks_x = 3;
	const ticks_y = 5;
	
	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });
	const frame = drawFrame(plot);

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `GOAL LOCATIONS`);
	const xTitle = drawXAxisTitle(plot, 'BALL X');
	const yTitle = drawYAxisTitle(plot, 'BALL Y');

	
	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x);
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y, true);
	
	// DATA
	const xScale = linearScale(min_x, max_x, plot.x, plot.x + plot.width - 1);
	const yScale = linearScale(min_y, max_y, plot.y + 1, plot.y + plot.height);
	const points = renderScatterPoints(data, xScale, yScale, colorOf);

	return (open + chartTitle + frame + xTitle + yTitle + xTicks + yTicks + points + close);
}
