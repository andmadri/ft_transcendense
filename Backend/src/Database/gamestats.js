import { getMatchEventsByMatchID } from './match.js';
import { sql_log, sql_error } from './dblogger.js';
import { inspect } from 'node:util';

export async function getMatchGoalsSummaryByMatchID(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchGoalsSummaryByMatchID id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchGoalsSummaryByMatchID | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

export async function getMatchEventsDB(db, matchId) {
	const matchEvents = await getMatchEventsByMatchID(db, matchId);

	console.log(`--- matchEvents --- ${matchId}`);
	console.table(matchEvents);


	const goalData = await getMatchGoalsSummaryByMatchID(db, matchId);

	console.log(`--- goalData --- ${matchId}`);
	console.table(goalData);

	// console.log('--- matchEvents --- keys:', 
	// matchId && typeof matchId === 'object' ? Object.keys(matchId) : null);
	// console.log('--- matchEvents --- inspect:\n', inspect(matchId, { depth: null, colors: true }));
}

/**
 * @brief Fetches a MatchEvents rows needed for making the scatter plot.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered goal data or null.
 */
export async function getMatchScatterDB(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT username, ball_x, ball_y FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchScatterDB id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchScatterDB | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvents rows needed for making the line graph.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered for line graph or null.
 */
export async function getMatchLineDB(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT goal, username, duration FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchLineDB id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchLineDB | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

/**
 * @brief Fetches a MatchEvents rows needed for making the bar chart.
 *
 * @param {number} match_id - The ID of the match to retrieve.
 * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered for bar chart or null.
 */
export async function getMatchBarDB(db, match_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT goal, username, hits FROM MatchGoalsSummary WHERE match_id = ?`;
		db.all(sql, [match_id], (err, rows) => {
			if (err) {
				sql_error(err, `getMatchBarDB id=${match_id}`);
				reject(err);
			} else {
				if (!rows) {
					sql_log(`getMatchBarDB | match_id not found! match_id=${match_id}`);
				}
				resolve(rows || []);
			}
		});
	});
}

// /**
//  * @brief Fetches a MatchEvents rows needed for making the scatter plot.
//  *
//  * @param {number} match_id - The ID of the match to retrieve.
//  * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered goal data or null.
//  */
// export async function getMatchScatterDB(db, match_id) {
// 	return new Promise((resolve, reject) => {
// 		const sql = `SELECT id, match_id, user_id AS scorer_id, ball_x, ball_y, timestamp FROM MatchEvents WHERE match_id = ? AND event_type = 'goal'`;
// 		db.all(sql, [match_id], (err, rows) => {
// 			if (err) {
// 				sql_error(err, `getMatchScatterDB id=${match_id}`);
// 				reject(err);
// 			} else {
// 				if (!rows) {
// 					sql_log(`getMatchScatterDB | match_id not found! match_id=${match_id}`);
// 				}
// 				resolve(rows || []);
// 			}
// 		});
// 	});
// }

// /**
//  * @brief Fetches a MatchEvents rows needed for making the line graph.
//  *
//  * @param {number} match_id - The ID of the match to retrieve.
//  * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered for line graph or null.
//  */
// export async function getMatchLineDB(db, match_id) {
// 	return new Promise((resolve, reject) => {
// 		const sql = `SELECT	u.name AS username,	e.timestamp AS timestamp
// 			FROM MatchEvents AS e LEFT JOIN Users AS u ON u.id = e.user_id
// 			WHERE e.match_id = ? AND e.event_type = 'goal' ORDER BY e.timestamp ASC`;
// 		db.all(sql, [match_id], (err, rows) => {
// 			if (err) {
// 				sql_error(err, `getMatchLineDB id=${match_id}`);
// 				reject(err);
// 			} else {
// 				if (!rows) {
// 					sql_log(`getMatchLineDB | match_id not found! match_id=${match_id}`);
// 				}
// 				resolve(rows || []);
// 			}
// 		});
// 	});
// }

// /**
//  * @brief Fetches a MatchEvents rows needed for making the bar chart.
//  *
//  * @param {number} match_id - The ID of the match to retrieve.
//  * @returns {Promise<Object|null>} - Resolves with matchEvents object filtered for bar chart or null.
//  */
// export async function getMatchBarDB(db, match_id) {
// 	return new Promise((resolve, reject) => {
// 		const sql = `WITH ordered AS (
// 					SELECT
// 						e.*,
// 						SUM(CASE WHEN e.event_type = 'serve' THEN 1 ELSE 0 END)
// 							OVER (PARTITION BY e.match_id ORDER BY e.timestamp ASC, e.id ASC) AS rally_id
// 						FROM MatchEvents e
// 						WHERE e.match_id = ?
// 					),
// 					goals AS (
// 						SELECT
// 							o.id,
// 							o.match_id,
// 							o.user_id,
// 							o.rally_id,
// 							o.timestamp,
// 							ROW_NUMBER() OVER (PARTITION BY o.match_id ORDER BY o.timestamp ASC, o.id ASC) AS goal
// 						FROM ordered o
// 						WHERE o.event_type = 'goal'
// 					),
// 					hits_per_rally AS (
// 						SELECT rally_id, COUNT(*) AS hits
// 						FROM ordered
// 						WHERE event_type = 'hit'
// 						GROUP BY rally_id
// 					)
// 					SELECT 
// 						g.goal AS goal,
// 						u.name AS username,
// 						COALESCE(h.hits, 0) AS hits
// 					FROM goals g LEFT JOIN hits_per_rally h ON h.rally_id = g.rally_id
// 					JOIN Users u ON u.id = g.user_id ORDER BY g.goal`;
// 		db.all(sql, [match_id], (err, rows) => {
// 			if (err) {
// 				sql_error(err, `getMatchBarDB id=${match_id}`);
// 				reject(err);
// 			} else {
// 				if (!rows) {
// 					sql_log(`getMatchBarDB | match_id not found! match_id=${match_id}`);
// 				}
// 				resolve(rows || []);
// 			}
// 		});
// 	});
// }


// ADDED FOR CREATING IMAGE IN THE BACKEND - complete file

import fs from 'fs';
import path from 'path';

const uploadsBase = process.env.UPLOADS_DIR || '/tmp/uploads';

const SQL = `
	SELECT u.name,
			usd.menu_secs,
			usd.lobby_secs,
			usd.game_secs,
			usd.login_secs
	FROM UserStateDurations usd
	JOIN Users u ON u.id = usd.user_id
	ORDER BY usd.login_secs DESC
`;

// sqlite3 db.all promisified (your project already uses sqlite3) :contentReference[oaicite:2]{index=2}
function dbAll(db, sql, params = []) {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
		if (err) return reject(err);
		resolve(rows || []);
		});
	});
}

function s2m(s) {
	const n = Number(s);
	if (!Number.isFinite(n)) return 0;
	return Math.round((n / 60) * 10) / 10;
}

function esc(text) {
	return String(text).replace(/[&<>"']/g, (c) =>
		({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
	);
}

/**
 * Render a stacked horizontal bar chart to an SVG file.
 * @param {import('sqlite3').Database} db  - open sqlite3 Database instance
 * @param {{ outDir?: string, fileName?: string, width?: number, barHeight?: number, gap?: number, margin?: {top:number,right:number,bottom:number,left:number} }} opts
 * @returns {Promise<string>} absolute path of the written SVG
 */
export async function renderUserStateDurationsSVG(db, opts = {}) {
	console.log('[BOOT] UPLOADS_DIR =', process.env.UPLOADS_DIR || '(unset)');

	const {
		outDir = path.join(uploadsBase , 'charts'),
		fileName,
		width = 1000,
		barHeight = 26,
		gap = 14,
		margin = { top: 50, right: 30, bottom: 40, left: 180 }
	} = opts;

	console.log('opts stats: ', opts);

	const rows = await dbAll(db, SQL);

	// Prepare data in minutes
	const data = rows.map(r => ({
		name: r.name,
		menu:  s2m(r.menu_secs),
		lobby: s2m(r.lobby_secs),
		game:  s2m(r.game_secs),
		total: s2m(r.login_secs)
	}));

	const n = data.length;
	const height = margin.top + margin.bottom + n * (barHeight + gap) - gap;

	// X scale: 0..max total
	const maxTotal = Math.max(1, ...data.map(d => d.total));
	const innerWidth = width - margin.left - margin.right;
	const scaleX = (v) => (v / maxTotal) * innerWidth;

	// Colors (accessible, distinct; tweak as you like)
	const C_MENU  = '#60a5fa'; // blue-400
	const C_LOBBY = '#f59e0b'; // amber-500
	const C_GAME  = '#34d399'; // emerald-400
	const BG      = '#0b1220'; // dark bg
	const AXIS    = '#cbd5e1'; // slate-300
	const TEXT    = '#e5e7eb'; // slate-200
	const GRID    = '#334155'; // slate-700

	// Helper to draw one bar row
	const rowsSvg = data.map((d, i) => {
		const y = margin.top + i * (barHeight + gap);
		let x = margin.left;

		const wMenu  = scaleX(d.menu);
		const wLobby = scaleX(d.lobby);
		const wGame  = scaleX(d.game);

		const labelY = y + barHeight * 0.72;

		// Value labels (only show when segment wide enough)
		const minLabelW = 40;
		const labelMenu  = wMenu  > minLabelW ? `<text x="${x + wMenu/2}" y="${labelY}" fill="${BG}" font-size="12" text-anchor="middle">${d.menu}</text>` : '';
		const labelLobby = wLobby > minLabelW ? `<text x="${x + wMenu + wLobby/2}" y="${labelY}" fill="${BG}" font-size="12" text-anchor="middle">${d.lobby}</text>` : '';
		const labelGame  = wGame  > minLabelW ? `<text x="${x + wMenu + wLobby + wGame/2}" y="${labelY}" fill="${BG}" font-size="12" text-anchor="middle">${d.game}</text>` : '';

		const bar = `
		<rect x="${x}" y="${y}" width="${wMenu}"  height="${barHeight}" fill="${C_MENU}"  rx="5" ry="5"/>
		<rect x="${x + wMenu}" y="${y}" width="${wLobby}" height="${barHeight}" fill="${C_LOBBY}" rx="5" ry="5"/>
		<rect x="${x + wMenu + wLobby}" y="${y}" width="${wGame}"  height="${barHeight}" fill="${C_GAME}"  rx="5" ry="5"/>
		${labelMenu}${labelLobby}${labelGame}
		`;

		// Left labels
		const name = `<text x="${margin.left - 10}" y="${labelY}" fill="${TEXT}" font-size="14" text-anchor="end">${esc(d.name)}</text>`;

		// Right total label
		const totalX = margin.left + scaleX(d.total) + 8;
		const total  = `<text x="${totalX}" y="${labelY}" fill="${TEXT}" font-size="13">${d.total} min</text>`;

		return name + bar + total;
	}).join('\n');

	// X axis ticks (5)
	const ticks = 5;
	const tickSvg = Array.from({ length: ticks + 1 }, (_, i) => {
		const v = Math.round((i / ticks) * maxTotal);
		const x = margin.left + scaleX(v);
		return `
		<line x1="${x}" y1="${margin.top - 8}" x2="${x}" y2="${height - margin.bottom}" stroke="${GRID}" stroke-width="1" />
		<text x="${x}" y="${height - margin.bottom + 22}" fill="${AXIS}" font-size="12" text-anchor="middle">${v}</text>
		`;
	}).join('\n');

	const legend = `
		<g transform="translate(${margin.left}, ${margin.top - 30})">
		<rect x="0" y="-12" width="12" height="12" fill="${C_MENU}" rx="2"/><text x="18" y="-2" fill="${AXIS}" font-size="12">Menu (min)</text>
		<rect x="110" y="-12" width="12" height="12" fill="${C_LOBBY}" rx="2"/><text x="128" y="-2" fill="${AXIS}" font-size="12">Lobby (min)</text>
		<rect x="215" y="-12" width="12" height="12" fill="${C_GAME}" rx="2"/><text x="233" y="-2" fill="${AXIS}" font-size="12">Game (min)</text>
		</g>
	`;

	const title = `<text x="${margin.left}" y="28" fill="${TEXT}" font-size="18" font-weight="600">User State Durations (minutes)</text>`;

	const svg = `<?xml version="1.0" encoding="UTF-8"?>
	<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">
	<rect x="0" y="0" width="${width}" height="${height}" fill="${BG}"/>
	${title}
	${legend}
	${tickSvg}
	${rowsSvg}
	</svg>`;
	return (svg);

	// let targetDir = outDir;
	// try {
	// 	fs.mkdirSync(targetDir, { recursive: true });
	// } catch (e) {
	// 	if (e.code === 'EACCES') {
	// 		const fallbackBase = process.env.UPLOADS_DIR || '/tmp/uploads';
	// 		targetDir = path.join(fallbackBase, 'charts');
	// 		fs.mkdirSync(targetDir, { recursive: true });
	// 		console.warn('[charts] EACCES creating', outDir, '— fell back to', targetDir);
	// 	} else {
	// 		throw e;
	// 	}
	// }
	// const fname = fileName || `user_state_durations_${Date.now()}.svg`;
	// const outPath = path.isAbsolute(outDir) ? path.join(outDir, fname) : path.join(process.cwd(), outDir, fname);
	// fs.writeFileSync(outPath, svg, 'utf8');
	// return outPath;
}
