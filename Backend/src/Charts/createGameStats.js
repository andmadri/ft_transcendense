import { createSvgCanvas } from './charts.js';
import { generateBarChartForMatch } from './createBar.js';
import { generateLineChartForMatch } from './createLine.js';
import { generateScatterChartForMatch } from './createScatter.js';
import { generateMatchInfo } from './createMatchInfo.js';
import { getMatchByID } from '../Database/match.js';

export async function generateAllChartsForMatch(db, socket, msg) {
	const matchID = msg.matchID;
	try {
		const matchinfo = await getMatchByID(db, matchID);
		if (!matchinfo || matchinfo.end_time == null) {
			throw Error(`No data from getMatchByID or Match not ended - matchID: ${matchID}`);
		}
	
		// Color for the users
		const palette = ['#f96216', '#f9d716'];
		const user_ids = [matchinfo.player_1_id, matchinfo.player_2_id]; 
		const colorOf = new Map(user_ids.map((u, i) => [u, palette[i % palette.length]]));
	
		// Create charts
		const infoChartSVG = await generateMatchInfo(db, matchID, matchinfo, colorOf);
		const barChartSVG = await generateBarChartForMatch(db, matchID, colorOf);
		const scatterChartSVG = await generateScatterChartForMatch(db, matchID, colorOf);
		const lineChartSVG = await generateLineChartForMatch(db, matchID, colorOf);
		
		// Send SVGs to frontend
		socket.emit('message', {
			action: 'gameStats',
			matchID,
			infoChartSVG: infoChartSVG,
			barChartSVG: barChartSVG,
			scatterChartSVG: scatterChartSVG,
			lineChartSVG: lineChartSVG,
		});
	} catch (err) {
		console.error('GENERATE_CHARTS_ERROR', err.message || err, 'generateAllChartsForMatch');
		const { open, close } = createSvgCanvas();
		const fallback = open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;

		socket.emit('message', {
			action: 'gameStats',
			matchID,
			infoChartSVG: fallback,
			barChartSVG: fallback,
			scatterChartSVG: fallback,
			lineChartSVG: fallback,
		});
	}
}