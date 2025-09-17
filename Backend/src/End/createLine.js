import { getMatchLineDB } from '../Database/gamestats.js';
import { createSvgCanvas, createPlotArea, drawFrame } from '../Charts/charts.js';
import { drawTitle, drawXAxisTitle, drawYAxisTitle } from '../Charts/titles.js';
import { linearScale } from '../Charts/scales.js';
import { drawXAxisTicks, drawYAxisTicks } from '../Charts/ticks.js';

export function renderLines(data, xScale, yScale, colorOf) {
	// Group by user
	const groups = new Map(); // username -> [{t, y}]
	for (const row of data) {
		const arr = groups.get(row.username) || [];
		arr.push({ t: Number(row.duration) || 0, y: 0 });
		groups.set(row.username, arr);
	}

	// For each user, sort by time and assign cumulative y = 1..n
	for (const [, arr] of groups) {
		arr.sort((a, b) => a.t - b.t);
		for (let i = 0; i < arr.length; i++) {
		arr[i].y = i + 1;
		}
	}

	// Build <path> per user
	const paths = [];
	for (const [user, arr] of groups) {
		if (!arr.length) continue;

		const d = arr
		.map((p, idx) => {
			const x = xScale(p.t);
			const y = yScale(p.y);
			return (idx === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
		})
		.join(' ');

		const stroke = colorOf.get(user) || '#ffffff';

		paths.push(
		`<path d="${d}"
			fill="none"
			stroke="${stroke}"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>`
		);
	}

	return `<g class="lines">${paths.join('')}</g>`;
}

export async function generateLineChartForMatch(db, matchID, colorOf) {
	const data = await getMatchLineDB(db, matchID);
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		console.log(`No data from getMatchLineDB - matchID: ${matchID}`);
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}
	console.log(`--- generateLineChartForMatch --- ${matchID}`);
	console.table(data);

	const min_x = 0;
	const min_y = 0;
	const max_x = Math.max(...data.map(d => Number(d.duration) || 0)); // make it dynamic
	const max_y = 5;
	const ticks_x = 8;
	const ticks_y = 6;

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });
	const frame = drawFrame(plot);
	
	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `SCORE PER PLAYER DURING · MATCH ${matchID}`);
	const xTitle = drawXAxisTitle(plot, 'TIME (S)');
	const yTitle = drawYAxisTitle(plot, 'GOALS');

	// DATA
	const xScale = linearScale(min_x, max_x, plot.x, plot.x + plot.width - 1);
	const yScale = linearScale(min_y, max_y, plot.y + plot.height, plot.y + 1);
	const lines = renderLines(data, xScale, yScale, colorOf);

	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x, true, { format: (s) => String(Math.round(s)) });
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y, false);

	return (open + chartTitle + frame + xTitle + yTitle + lines + xTicks + yTicks + close);
}