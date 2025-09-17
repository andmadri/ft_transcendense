import { match } from 'assert';
import { getMatchEventsDB, renderUserStateDurationsSVG } from '../Database/gamestats.js';
import { generateBarChartForMatch } from './createBar.js';
import { generateLineChartForMatch } from './createLine.js';
import { generateScatterChartForMatch } from './createScatter.js';
import fs from 'fs';
import path from 'path';

export const visual = {
	colors: {bl: 'black', wh: 'white', gr: '#363430', or: '#ff6117', ye: '#ffc433', ly: '#ffc433'},
	chartWidth: 200,
	chartHeight: 150,
	margin: { top: 50, right: 10, bottom: 30, left: 30 }
};

const uploadsBase = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

async function generateSVG(outDir, fileName, svg) {
	let targetDir = outDir;

	try {
		fs.mkdirSync(targetDir, { recursive: true });
	} catch (e) {
		if (e.code === 'EACCES') {
			const fallbackBase = process.env.UPLOADS_DIR || '/tmp/uploads';
			targetDir = path.join(fallbackBase, 'charts');
			fs.mkdirSync(targetDir, { recursive: true });
			console.warn('[charts] EACCES creating', outDir, '— fell back to', targetDir);
		} else {
			throw e;
		}
	}
	const fname = fileName;
	const outPath = path.isAbsolute(outDir) ? path.join(outDir, fname) : path.join(process.cwd(), outDir, fname);
	if (typeof svg !== 'string') {
		throw new TypeError(`generateSVG expected a string, got ${typeof svg}`);
	}
	fs.writeFileSync(outPath, svg, 'utf8');
	return outPath;
}

export async function generateAllChartsForMatch(db, match, matchID) {

	const goalData = await getMatchEventsDB(db, matchID);
	const outDir = path.join(uploadsBase, 'charts', String(matchID));

	// COLOR FOR THE USERS
	const users = [...new Set(goalData.map(d => d.username))];
	const palette = ['#f96216', '#f9d716'];
	const colorOf = new Map(users.map((u, i) => [u, palette[i % palette.length]]));

	// BAR CHART
	const barChartSVG = await generateBarChartForMatch(db, matchID);
	const svgBarChart = await generateSVG(outDir, `bar_chart_${String(matchID)}.svg`, barChartSVG);
	console.log('Chart saved at:', svgBarChart);

	// SCATTER CHART
	const scatterChartSVG = await generateScatterChartForMatch(db, matchID, colorOf);
	const svgScatterChart = await generateSVG(outDir, `scatter_chart_${String(matchID)}.svg`, scatterChartSVG);
	console.log('Chart saved at:', svgScatterChart);

	// LINE CHART
	const lineChartSVG = await generateLineChartForMatch(db, matchID, colorOf);
	const svgLineChart = await generateSVG(outDir, `line_chart_${String(matchID)}.svg`, lineChartSVG);
	console.log('Chart saved at:', svgLineChart);



	// EXAMPLE USERSTATE DURATION
	const svgPath = await renderUserStateDurationsSVG(db, {
		outDir: path.join(uploadsBase, 'charts', String(matchID)),
		fileName: `user_state_durations_match_${String(matchID)}.svg`,
		width: 1000,
		barHeight: 26
	});
	const svgChart = await generateSVG(outDir, `user_state_durations_match_${String(matchID)}.svg`, svgPath);
	console.log('Chart 1 saved at:', svgChart);
}