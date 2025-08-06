import { addMatchToDB } from '../Database/match.js';
import { addMatchEventToDB } from '../Database/match.js';
import { updateMatchInDB, getMatchByID } from '../Database/match.js';
import { updatePlayersSession } from './sessionsService.js';

export async function handleMatchStart(db, match) {
	// QUESTION THIS LATER: Should we check if the players is already in the game / logged in? - Or check before so it doesn't get complexed for the AI and guest?
	
	// If one of the players is AI or guest, automaticly assign match_type (vs_ai, vs_guest ect.)

	// Step 1: Log the match
	const matchID = await addMatchToDB(db, match);

	// Step 2: Update the UserSessions
	await updatePlayersSession(db, [match.player_1_id, match.player_2_id], 'in_game');

	return matchID;
}

export async function handleMatchEvent(db, event) {
	// Step 1: Log the event
	const eventID = await addMatchEventToDB(db, event);

	// Step 2: Check if the event is a goal
	if (event.event_type === 'goal') {
		const match = await getMatchByID(db, event.match_id);
		if (!match) {
			throw new Error(`Match ID ${event.match_id} not found`)
		}

		let updated = {
			match_id: event.match_id
		};
		if (match.player_1_id === event.user_id) {
			updated.player_2_score = (match.player_2_score || 0) + 1;
		} else if (match.player_2_id === event.user_id) {
			updated.player_1_score = (match.player_1_score || 0) + 1;
		} else {
			console.warn(`User ${event.user_id} not in match ${event.match_id}`)
		}
		// ADD THIS LATER: Check for finish game? And if game finished change userSessions again!

		await updateMatchInDB(db, updated);

		// ADD THIS LATER: update user stats

		// What should happen if the game is ended? User back to main menu - or lobby for tournament?
	}
	return eventID;
}
