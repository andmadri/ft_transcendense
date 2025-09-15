import { getMatchLineDB } from '../Database/gamestats.js';

export async function generateLineChartForMatch(db, matchID) {
	const data = await getMatchLineDB(db, matchID);
	if (!data) {
		console.log(`No data from getMatchLineDB - matchID: ${matchID}`);
		return ;
	}

	// CREATE CHART HERE
	console.log(`--- generateLineChartForMatch --- ${matchID}`);
	console.table(data);
}