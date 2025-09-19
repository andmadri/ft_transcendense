import { createSvgCanvas, createPlotArea, drawFrame } from '../Charts/charts.js';
import { drawTitle,} from '../Charts/titles.js';

function getLineSVG(fontSize, txt, x, y, color) {
	const fillColor = color || 'white';
	return `
		<text x="${x}" y="${y}" font-size="${fontSize}px" fill="${fillColor}" style="font-family: 'Horizon', sans-serif;">
			${txt}
		</text>
	`;
}

function getSquare(nr, name, score, color) {
	const plot = {
		x: nr == 1 ? 50 : 550,
		y: 80,
		width: 400,
		height: 150
	};
	const fill = color;
	const stroke = '#ffffff';
	const sw = 3;

	const bottomY = plot.y + plot.height;
	const rightX = plot.x + plot.width;
	return `<!-- plot background -->
			<rect x="${plot.x}" y="${plot.y}" width="${plot.width}" height="${plot.height}"
				fill="${fill}" stroke="none"/>
			
			${getLineSVG(40, name, plot.x + 30, plot.y + 50, 'black')}
			${getLineSVG(40, `score: ${score}`, plot.x + 30, plot.y + 100, 'black')}

			<!-- left Y baseline -->
			<line x1="${plot.x}" y1="${plot.y}" x2="${plot.x}" y2="${bottomY}"
				stroke="${stroke}" stroke-width="${sw}"/>

			<!-- bottom X baseline -->
			<line x1="${plot.x}" y1="${bottomY}" x2="${rightX}" y2="${bottomY}"
				stroke="${stroke}" stroke-width="${sw}"/>
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
function getGameStatsSVG(data, players) {
	const {player1, player2} = players;
	const match_duration = getDurationInSec(data);
	const winner = data.player_1_id == data.winner_id ? player1 : player2;

	const gameStatsSVG = `
		${getLineSVG(40, 'vs', 480, 175)}
		${getLineSVG(40, `data: ${data.start_time}`, 80, 400)}
		${getLineSVG(40, `playing time: ${match_duration}`, 80, 460)}
		${getLineSVG(40, `winner: ${winner}`, 80, 520)}
	`;
	return (gameStatsSVG);
}

export async function generateMatchInfo(matchID, data, players, colorOf) {
	const {player1, player2} = players;
	const { width, height, open, close } = createSvgCanvas();
	if (!data || data.length === 0) {
		console.log(`No data from getMatchInfoDB - matchID: ${matchID}`);
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	const min_x = 0;
	const min_y = 0;
	const max_x = 100;
	const max_y = 600;

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `MATCH ${matchID} STATS`);

	const frame1 = getSquare(1, player1, data.player_1_score, colorOf.get(data.player_1_id));
	const frame2 = getSquare(2, player2, data.player_2_score, colorOf.get(data.player_2_id))
	// DATA
	const svgtext = getGameStatsSVG(data, players);

	return (open + chartTitle + frame1 + frame2 + svgtext + close);
}
