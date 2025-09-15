import { getMatchEventsDB, renderUserStateDurationsSVG } from '../Database/gamestats.js';

import path from 'path';

const uploadsBase = process.env.UPLOADS_DIR || '/tmp/uploads';

export async function generateAllChartsForMatch(db, match, matchID) {

	getMatchEventsDB(db, matchID);

	const idForName = String(matchID);
	
	const svgPath = await renderUserStateDurationsSVG(db, {
		outDir: path.join(uploadsBase, 'charts', idForName),
		fileName: `user_state_durations_match_${idForName}.svg`,
		width: 1000,
		barHeight: 26
	});
	console.log('Chart saved at:', svgPath);
	// console.log('2. Chart saved at:', svgPath);
	// console.log('3. Chart saved at:', svgPath);
}