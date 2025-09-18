import { createSvgCanvas, createPlotArea, drawFrame } from '../Charts/charts.js';
import { drawTitle,} from '../Charts/titles.js';
import { linearScale } from '../Charts/scales.js';
import { getMatchByID } from '../Database/match.js';

function getLineSVG(fontSize, txt, x, y, color) {
	const fillColor = color || 'white';
	return `
		<text x="${x}" y="${y}" font-size="${fontSize}px" fill="${fillColor}" style="font-family: 'Horizon', sans-serif;">
			${txt}
		</text>
	`;
}

function getDurationInSec(data) {
	const startDate = new Date(data.start_time);
	const endDate = new Date(data.end_time);
	
	const durationMS = endDate - startDate;
	const minutes = Math.floor(durationMS / 1000 / 60);
	const secondes = Math.floor((durationMS / 1000) % 60);
	return (minutes + ':' + secondes);
}

// Creates the left upper part with the basic game stats
function getGameStatsSVG(data) {
	const match_duration = getDurationInSec(data);

	const gameStatsSVG = `
		${getLineSVG(34, `${data.player_1_id}  |  score: ${data.player_1_score}`, 80, 200, '#ff6117')}
		${getLineSVG(24, 'vs', 80, 230)}
		${getLineSVG(34, `${data.player_2_id}  |  score: ${data.player_2_score}`, 80, 260, '#ffc433')}
		${getLineSVG(24, `playing time: ${match_duration}`, 80, 290)}
		${getLineSVG(24, `winner: ${data.winner_id}`, 80, 320)}
	`;
	return (gameStatsSVG);
}

export async function generateMatchInfo(db, matchID, colorOf) {
	const data = await getMatchByID(db, matchID);
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		console.log(`No data from getMatchInfoDB - matchID: ${matchID}`);
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// CREATE CHART HERE
	console.log(`--- generateMatchInfo --- ${matchID}`);
	console.table(data);

	const min_x = 0;
	const min_y = 0;
	const max_x = 100;
	const max_y = 600;

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `MATCH INFO · MATCH ${matchID}`);

	// DATA
	const svgtext = getGameStatsSVG(data);

	return (open + chartTitle + svgtext + close);
}
