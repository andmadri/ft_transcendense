import { generateBarChartForMatch } from './createBar.js';
import { generateLineChartForMatch } from './createLine.js';
import { generateScatterChartForMatch } from './createScatter.js';
import { generateMatchInfo } from './createMatchInfo.js';
import { getMatchByID } from '../Database/match.js';
import { getUsersByIDs } from '../Database/users.js';

export async function generateAllChartsForMatch(db, socket, msg) {
	const matchID = msg.matchID;
	const matchinfo = await getMatchByID(db, matchID);
	const players = await getUsersByIDs(db, matchinfo.player_1_id, matchinfo.player_2_id);

	// COLOR FOR THE USERS
	const palette = ['#f96216', '#f9d716'];
	const user_ids = [matchinfo.player_1_id, matchinfo.player_2_id]; 
	const colorOf = new Map(user_ids.map((u, i) => [u, palette[i % palette.length]]));

	try {
		const infoChartSVG = await generateMatchInfo(matchID, matchinfo, players, colorOf);
		const barChartSVG = await generateBarChartForMatch(db, matchID, colorOf);
		const scatterChartSVG = await generateScatterChartForMatch(db, matchID, colorOf);
		const lineChartSVG = await generateLineChartForMatch(db, matchID, colorOf);
		
		// Send SVGs to frontend
		socket.emit('message', {
			action: 'gameStats',
			matchID,
			infoChartSVG,
			barChartSVG,
			scatterChartSVG,
			lineChartSVG,
		});
	} catch (err) {
		const fallback = `
			<?xml version="1.0" encoding="UTF-8"?>
			<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
			<rect x="0" y="0" width="200" height="100" fill="#333"/>
			<text x="100" y="55" font-size="16" fill="#fff" text-anchor="middle">No data</text>
			</svg>
		`
		console.error(err, 'generating Charts');

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