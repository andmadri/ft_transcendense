import { addMatchToDB } from '../Database/match.js';
import { addMatchEventToDB } from '../Database/match.js';
import { updateMatchInDB, getMatchByID } from '../Database/match.js';
import { updatePlayersSessionDB } from './sessionsService.js';

/**
 * @brief Starts a new match, auto-determining match_type and marking players in-game.
 * @param {object} db               SQLite database handle.
 * @param {object} game             Games object.
 * @param {number} game.player_1_id    First player’s user ID.
 * @param {number} game.player_2_id    Second player’s user ID.
 * @param {boolean} [game.isTournament=false]  True for tournament matches.
 * @return {Promise<number>}         Resolves to the new match ID.
 * @throws {Error}                   If guest vs AI is attempted or IDs are invalid.
 */
export async function handleMatchStartDB(db, { player_1_id, player_2_id, isTournament = false }) {
	// Disallow Guest(1) vs AI(2)
	if ((player_1_id === 1 && player_2_id === 2) ||
		(player_1_id === 2 && player_2_id === 1))
			throw new Error('Matches between Guest (1) and AI (2) are not allowed');

	// Code below will give problems when multiple people will play against AI / Guest at the same time
	// // Make sure neither player is already in an active match
	// const sql = `SELECT 1 FROM Matches WHERE end_time IS NULL 
	// 			AND (player_1_id = ? OR player_2_id = ? OR player_1_id = ? OR player_2_id = ?)
	// 			LIMIT 1;`
	// const active = await db.get(sql, [player_1_id, player_1_id, player_2_id, player_2_id]);
	// if (active)
	// 	throw new Error('One or both players are already in an active match');

	// Find out the correct the match_type
	let match_type;
	if (isTournament) {
		match_type = 'tournament';
	} else if (player_1_id === 1 || player_2_id === 1) {
		match_type = 'vs_guest';
	} else if (player_1_id === 2 || player_2_id === 2) {
		match_type = 'vs_ai';
	} else {
		match_type = '1v1';
	}

	// Insert the match
	const matchID = await addMatchToDB(db, {
		player_1_id,
		player_2_id,
		match_type
	});

	// Add the players to 'in_game' in UserSessions
	await updatePlayersSessionDB(db, [player_1_id, player_2_id], 'in_game');

	// Return the match row
	return (matchID);
}

/**
 * @brief Logs a match event and updates the match score on goal events.
 * @param {object} db               SQLite database handle.
 * @param {object} event            Event details.
 * @param {number} event.match_id   ID of the match.
 * @param {number} event.user_id    ID of the player causing the event.
 * @param {string} event.event_type Type of event (e.g., 'goal').
 * @return {Promise<number>}        Resolves to the new MatchEvent ID.
 * @throws {Error}                  If the referenced match is not found.
 */
export async function handleMatchEventDB(db, event) {
	// Log the event
	const MatchEventID = await addMatchEventToDB(db, event);

	// If the event is a goal update the match row
	if (event.event_type === 'goal') {
		const match = await getMatchByID(db, event.match_id);
		if (!match) {
			throw new Error(`Match ID ${event.match_id} not found`);
		}

		let updated = {
			match_id: event.match_id
		};
		if (match.player_1_id === event.user_id) {
			updated.player_1_score = (match.player_1_score || 0) + 1;
		} else if (match.player_2_id === event.user_id) {
			updated.player_2_score = (match.player_2_score || 0) + 1;
		} else {
			console.warn(`User ${event.user_id} not in match ${event.match_id}`)
		}
		await updateMatchInDB(db, updated);
	}

	// Return the MatchEvent row
	return MatchEventID;
}

/**
 * @brief Finalizes a match by setting the winner, end_time, and resetting player sessions.
 * @param {object} db             SQLite database handle.
 * @param {number} match_id       ID of the match to end.
 * @return {Promise<object>}      Resolves to the updated match row.
 * @throws {Error}                If the match is not found.
 */
export async function handleMatchEndedDB(db, match_id) {
	// Fetch the excisting match to get the player IDs
	const match = await getMatchByID(db, match_id);
	if (!match) {
		throw new Error(`Match ID ${match_id} not found`);
	}

	// Find out who is the winner
	let winner_id = null;
	if (match.winnerID) {
		if (match.winnerID == -1) {
			return;
		}
		winner_id = match.winnerID;
	}
	else if (match.player_1_score > match.player_2_score) {
		winner_id = match.player_1_id;
	} else if (match.player_1_score < match.player_2_score) {
		winner_id = match.player_2_id;
	}

	// Update the match row, so we have a winner and an end_time
	await updateMatchInDB(db, {
		match_id: match.id,
		winner_id: winner_id,
		end_time: true
	})

	// Add the players to 'in_menu' in UserSessions
	await updatePlayersSessionDB(db, [match.player_1_id, match.player_2_id], 'in_menu');

	// Return the updated match row
	return (await getMatchByID(db, match_id));
}
