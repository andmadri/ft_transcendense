import { getMatchLineDB } from '../Database/gamestats.js';
import { createSvgCanvas, createPlotArea, drawFrame } from '../Charts/charts.js';
import { drawTitle, drawXAxisTitle, drawYAxisTitle } from '../Charts/titles.js';
import { linearScale } from '../Charts/scales.js';
import { drawXAxisTicks, drawYAxisTicks } from '../Charts/ticks.js';

export function buildStepSeries(data) {
	// Normalize + sort by time
	const rows = [...data]
		.map(r => ({ user: r.user_id, t: Number(r.duration) || 0 }))
		.sort((a, b) => a.t - b.t);
	
	const endT = rows.length ? Math.max(...rows.map(r => r.t)) : 0;
	const users = [...new Set(rows.map(r => r.user))];

	// Initialize series with (0,0) for each user
	const series = new Map();
	const counts = Object.create(null);
	for (const u of users) {
		series.set(u, [{ t: 0, y: 0 }]);
		counts[u] = 0;
	}

	// Walk through data in time order and build step points
	for (const r of rows) {
		const u = r.user;
		const pts = series.get(u);
		const y = counts[u];
		const last = pts[pts.length - 1];
		
		if (!last || last.t !== r.t || last.y !== y) {
			pts.push({ t: r.t, y });
		}

		counts[u] = y + 1;
		pts.push({ t: r.t, y: counts[u] });
	}

	// Extend both players flat to endT
	for (const u of users) {
		const pts = series.get(u);
		const finalY = counts[u] || 0;
		const last = pts[pts.length - 1];

		if (!last || last.t !== endT || last.y !== finalY) {
			pts.push({ t: endT, y: finalY });
		}
	}

	return { series, endT };
}

export function renderLines(series, xScale, yScale, colorOf) {
	const paths = [];
	const dots  = [];

	for (const [user, pts] of series) {
		if (!pts || pts.length === 0) {
			continue ;
		}

		// Get the correct color
		const fill = colorOf.get(user) || '#ffffff';

		// Move to first point
		let d = `M ${xScale(pts[0].t)} ${yScale(pts[0].y)}`;

		// Walk the sequence: if time changes -> horizontal (H), else vertical (V)
		for (let i = 1; i < pts.length; i++) {
			const prev = pts[i - 1];
			const cur = pts[i];
			const X = xScale(cur.t);
			const Y = yScale(cur.y);

			if (cur.t !== prev.t) {
				d += ` H ${X}`; // flat segment forward in time
			} else {
				d += ` V ${Y}`; // jump up at the same time
				dots.push(`<circle cx="${X}" cy="${Y}" r="7" fill="${fill}" />`);
			}
		}

		// Draw the lines
		paths.push(
			`<path d="${d}"
				fill="none"
				stroke="${fill}"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>`
		);
	}

	return `<g class="step-lines">${paths.join('')}<g class="goal-dots">${dots.join('')}</g></g>`;
}

export async function generateLineChartForMatch(db, matchID, colorOf) {
	const data = await getMatchLineDB(db, matchID);
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// SET VALUES
	const { series, endT } = buildStepSeries(data);
	const min_x = 0;
	const min_y = 0;
	const max_x = endT || 1;
	const max_y = 5;
	const ticks_x = 8;
	const ticks_y = 6;

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });
	const frame = drawFrame(plot);
	
	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `SCORE FLOW`);
	const xTitle = drawXAxisTitle(plot, 'TIME (S)');
	const yTitle = drawYAxisTitle(plot, 'GOALS');

	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x, true, true, 0);
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y);

	// DATA
	const xScale = linearScale(min_x, max_x, plot.x, plot.x + plot.width - 1);
	const yScale = linearScale(min_y, max_y, plot.y + plot.height, plot.y + 1);
	const lines = renderLines(series, xScale, yScale, colorOf);

	return (open + chartTitle + frame + xTitle + yTitle + xTicks + yTicks + lines + close);
}