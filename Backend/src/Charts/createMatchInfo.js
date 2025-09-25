import { createSvgCanvas, createPlotArea } from './charts.js';
import { drawTitle,} from './titles.js';
import { getUserByID } from '../Database/users.js';

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

function formatDurationSecs(data) {
	const startDate = new Date(data.start_time);
	const endDate = new Date(data.end_time);
	
	const durationMS = endDate - startDate;
	const n = Math.round(Number(durationMS / 1000));
	if (!Number.isFinite(n)) {
		return '';
	}
	if (n < 60) {
		return `${n}s`;
	}
	const m = Math.floor(n / 60);
	const s = n % 60;
	return `${m}m ${s.toString().padStart(2, '0')}s`;
}

// Creates the left upper part with the basic game stats
async function getGameStatsSVG(db, data) {
	const match_duration = formatDurationSecs(data);
	let winner = 'No winner';
	if (data.winner_id !== null) {
		try {
			const winnerId = await getUserByID(db, data.winner_id);
			winner = winnerId.name;
		} catch (err) {
			console.error('DB_ERROR', `Error fetching winner data for user ID ${data.winner_id}: ${err.message || err}`, 'getGameStatsSVG');
		}
	}

	const gameStatsSVG = `
		${getLineSVG(40, 'vs', 480, 175)}
		${getLineSVG(40, `Start date: ${data.start_time}`, 80, 400)}
		${getLineSVG(40, `End date: ${data.end_time}`, 80, 450)}
		${getLineSVG(40, `Playing time: ${match_duration}`, 80, 500)}
		${getLineSVG(40, `Winner: ${winner}`, 80, 550)}
	`;
	return (gameStatsSVG);
}

export async function generateMatchInfo(db, matchID, data, colorOf) {
	const { width, height, open, close } = createSvgCanvas();
	let player1 = null;
	let player2 = null;
	try {
		player1 = await getUserByID(db, data.player_1_id);
		player2 = await getUserByID(db, data.player_2_id);
		if (!player1 || !player2) {
			console.error('DB_ERROR', `Error fetching players with IDs ${data.player_1_id} or ${data.player_2_id}: ${err.message}`, 'generateMatchInfo');
			return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
		}
	} catch (err) {
		console.error('DB_ERROR', `Database error in getUserByID: ${err.message || err}`, 'generateMatchInfo');
		return open + `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb">No data</text>` + close;
	}

	// CREATE CHART HERE
	const { margins, plot } = createPlotArea({ width, height });

	// TITLES
	const chartTitle = drawTitle({ width, height }, margins, `MATCH ${matchID} STATS`);

	const frame1 = getSquare(1, player1.name, data.player_1_score, colorOf.get(data.player_1_id));
	const frame2 = getSquare(2, player2.name, data.player_2_score, colorOf.get(data.player_2_id))
	// DATA
	const svgtext = await getGameStatsSVG(db, data);

	return (open + chartTitle + frame1 + frame2 + svgtext + close);
}
