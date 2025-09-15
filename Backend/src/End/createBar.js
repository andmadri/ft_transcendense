import { getMatchBarDB } from '../Database/gamestats.js';

export async function generateBarChartForMatch(db, matchID) {
	const data = await getMatchBarDB(db, matchID);
	if (!data) {
		console.log(`No data from getMatchBarDB - matchID: ${matchID}`);
		return ;
	}

	// CREATE CHART HERE
}



