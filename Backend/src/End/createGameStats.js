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
	margin: { top: 50, right: 30, bottom: 40, left: 180 }
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
	fs.writeFileSync(outPath, svg, 'utf8');
	return outPath;
}

export async function generateAllChartsForMatch(db, match, matchID) {

	await getMatchEventsDB(db, matchID);
	const outDir = path.join(uploadsBase, 'charts', String(matchID));

	// BAR CHART
	const barChartSVG = await generateBarChartForMatch(db, matchID);
	const svgBarChart = await generateSVG(outDir, `bar_chart_${String(matchID)}.svg`, barChartSVG);
	console.log('Chart saved at:', svgBarChart);

	// SCATTER CHART
	await generateScatterChartForMatch(db, matchID);

	// LINE CHART
	await generateLineChartForMatch(db, matchID);



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