import { getMatchScatterDB } from '../Database/gamestats.js';

export async function generateScatterChartForMatch(db, matchID) {
	const data = await getMatchScatterDB(db, matchID);
	if (!data) {
		console.log(`No data from getMatchScatterDB - matchID: ${matchID}`);
		return ;
	}

	// CREATE CHART HERE
	console.log(`--- generateScatterChartForMatch --- ${matchID}`);
	console.table(data);
}