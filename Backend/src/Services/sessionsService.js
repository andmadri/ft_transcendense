import { addUserSessionToDB } from '../Database/sessions.js'
import { tournament, leaveTournament } from '../Tournament/tournament.js';

export async function updatePlayersSessionDB(db, user_ids, state) {
	await Promise.all(
		user_ids.map(user_id => addUserSessionToDB(db, { user_id, state }))
	);
}

export async function onUserLogin(db, user_id) {
	try {
		await addUserSessionToDB(db, { user_id, state: 'login' });
		await addUserSessionToDB(db, { user_id, state: 'in_menu' });
	} catch (err) {
		console.error('AddUserSession: ' + err);
	}
}

/**
 * Handle user logout by updating session state and managing tournament participation.
 * @param {Object} db - The database connection object.
 * @param {number} user_id - The ID of the user logging out.
 */
export async function onUserLogout(db, user_id) {
	try {
		const tournamentPlayer = tournament.players.find(p => p.id === user_id);
		if (tournamentPlayer && tournamentPlayer.socket) {
			tournamentPlayer.ready = false;
			leaveTournament({ name: tournamentPlayer.name }, tournamentPlayer.id, tournamentPlayer.socket, tournament.io);
		}
		await addUserSessionToDB(db, { user_id, state: 'logout' });
	} catch (err) {
		console.error('AddUserSession: ' + err);
	}
}
