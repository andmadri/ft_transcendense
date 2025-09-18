import { getMatchScatterDB } from '../Database/gamestats.js';
import { createSvgCanvas, createPlotArea, drawFrame } from '../Charts/charts.js';
import { drawTitle, drawXAxisTitle, drawYAxisTitle } from '../Charts/titles.js';
import { linearScale } from '../Charts/scales.js';
import { drawXAxisTicks, drawYAxisTicks } from '../Charts/ticks.js';

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
	const data = await getMatchScatterDB(db, matchID);
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		console.log(`No data from getMatchScatterDB - matchID: ${matchID}`);
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	const min_x = 0;
	const min_y = 0;
	const max_x = 1;
	const max_y = 1;
	const ticks_x = 3;
	const ticks_y = 5;

	console.log(`--- generateScatterChartForMatch --- ${matchID}`);
	console.table(data);
	
	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });
	const frame = drawFrame(plot);

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `GOAL LOCATIONS · MATCH ${matchID}`);
	const xTitle = drawXAxisTitle(plot, 'BALL X');
	const yTitle = drawYAxisTitle(plot, 'BALL Y');

	
	// VALUES AXIS
	const xTicks = drawXAxisTicks(plot, min_x, max_x, ticks_x, false);
	const yTicks = drawYAxisTicks(plot, min_y, max_y, ticks_y, true);
	
	// DATA
	const xScale = linearScale(min_x, max_x, plot.x, plot.x + plot.width - 1);
	const yScale = linearScale(min_y, max_y, plot.y + 1, plot.y + plot.height);
	const points = renderScatterPoints(data, xScale, yScale, colorOf);

	return (open + chartTitle + frame + xTitle + yTitle + xTicks + yTicks + points + close);
}











// 	// --- Layout
// 	const WIDTH = 1000;
// 	const HEIGHT = 600;
// 	const M = { top: 40, right: 180, bottom: 50, left: 60 };
// 	const PW = WIDTH - M.left - M.right;   // plot width
// 	const PH = HEIGHT - M.top - M.bottom;  // plot height

// 	// --- Helpers
// 	const clamp01 = (v) => Math.max(0, Math.min(1, Number(v)));
// 	const xPix = (x) => M.left + clamp01(x) * PW;
// 	// SVG y grows downward; invert so 0 is bottom, 1 is top
// 	const yPix = (y) => M.top + (1 - clamp01(y)) * PH;

// 	// --- Series colors by username
// 	const users = [...new Set(data.map(r => r.username || 'Unknown'))];
// 	const PALETTE = [
// 		'#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
// 		'#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
// 		'#bcbd22', '#17becf'
// 	];
// 	const colorOf = (u) => PALETTE[users.indexOf(u) % PALETTE.length];

// 	// --- Axes & ticks
// 	const ticks = [0, 0.25, 0.5, 0.75, 1];

// 	const gridLines = ticks.map(t => {
// 		const gx = xPix(t);
// 		const gy = yPix(t);
// 		return `
// 		<line x1="${gx}" y1="${M.top}" x2="${gx}" y2="${M.top + PH}" stroke="#eee"/>
// 		<line x1="${M.left}" y1="${gy}" x2="${M.left + PW}" y2="${gy}" stroke="#eee"/>
// 		`;
// 	}).join('');

// 	const xTicks = ticks.map(t => `
// 		<g transform="translate(${xPix(t)}, ${M.top + PH})">
// 		<line y2="6" stroke="#333"/>
// 		<text y="22" text-anchor="middle" font-size="12" fill="#333">${t.toFixed(2)}</text>
// 		</g>
// 	`).join('');

// 	const yTicks = ticks.map(t => `
// 		<g transform="translate(${M.left}, ${yPix(t)})">
// 		<line x1="-6" stroke="#333"/>
// 		<text x="-10" dy="0.35em" text-anchor="end" font-size="12" fill="#333">${t.toFixed(2)}</text>
// 		</g>
// 	`).join('');

// 	// --- Points
// 	const points = data.map((r) => {
// 		const u = r.username || 'Unknown';
// 		const cx = xPix(r.ball_x);
// 		const cy = yPix(r.ball_y);
// 		return `<circle cx="${cx}" cy="${cy}" r="5" fill="${colorOf(u)}" stroke="#000" stroke-opacity="0.25"/>`;
// 	}).join('');

// 	// --- Legend
// 	const legendItems = users.map((u, i) => {
// 		const y = M.top + i * 22;
// 		return `
// 		<g transform="translate(${M.left + PW + 24}, ${y})">
// 			<rect x="0" y="-8" width="14" height="14" fill="${colorOf(u)}" stroke="#000" stroke-opacity="0.2"/>
// 			<text x="20" dy="0.35em" font-size="13" fill="#222">${escapeXML(u)}</text>
// 		</g>
// 		`;
// 	}).join('');

// 	// --- Title & axis labels
// 	const title = `Goal locations · match ${matchID}`;
// 	const xLabel = 'ball_x (0..1)';
// 	const yLabel = 'ball_y (0..1)';

// 	// --- Assemble SVG
// 	return `<?xml version="1.0" encoding="UTF-8"?>
// 	<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
// 	<style>
// 		text { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
// 	</style>

// 	<!-- Title -->
// 	<text x="${WIDTH/2}" y="24" text-anchor="middle" font-size="18" font-weight="600" fill="#111">${escapeXML(title)}</text>

// 	<!-- Plot frame -->
// 	<rect x="${M.left}" y="${M.top}" width="${PW}" height="${PH}" fill="#fff" stroke="#ccc"/>

// 	<!-- Grid -->
// 	${gridLines}

// 	<!-- Axes -->
// 	<line x1="${M.left}" y1="${M.top + PH}" x2="${M.left + PW}" y2="${M.top + PH}" stroke="#333"/>
// 	<line x1="${M.left}" y1="${M.top}" x2="${M.left}" y2="${M.top + PH}" stroke="#333"/>

// 	<!-- Ticks -->
// 	${xTicks}
// 	${yTicks}

// 	<!-- Axis labels -->
// 	<text x="${M.left + PW/2}" y="${M.top + PH + 42}" text-anchor="middle" font-size="13" fill="#333">${escapeXML(xLabel)}</text>
// 	<g transform="translate(${M.left - 46}, ${M.top + PH/2}) rotate(-90)">
// 		<text text-anchor="middle" font-size="13" fill="#333">${escapeXML(yLabel)}</text>
// 	</g>

// 	<!-- Points -->
// 	${points}

// 	<!-- Legend -->
// 	${legendItems}
// </svg>`;
// }

// // Fallback SVG when there are no points
// function emptySVG(message = 'No data') {
// 	const W = 800, H = 300;
// 	return `<?xml version="1.0" encoding="UTF-8"?>
// 	<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
// 		<rect width="100%" height="100%" fill="#fff"/>
// 		<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="16" fill="#666">${escapeXML(message)}</text>
// 	</svg>`;
// }

// function escapeXML(s) {
// 	return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
// }