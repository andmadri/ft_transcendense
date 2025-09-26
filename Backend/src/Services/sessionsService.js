import { addUserSessionToDB } from '../Database/sessions.js'
import { tournament, leaveTournament } from '../Tournament/tournament.js';
import { getLastUserSession } from '../Database/sessions.js';

export async function updatePlayersSessionDB(db, user_ids, state) {
	await Promise.all(
		user_ids.map(user_id => setUserSession(db, user_id, state))
	);
}

export async function onUserLogin(db, user_id) {
	try {
		const lastUserSession = await getLastUserSession(db, user_id);
		if (!lastUserSession || (lastUserSession && lastUserSession.state !== 'login')) {
			await addUserSessionToDB(db, { user_id, state: 'login' });
		}
		await setUserSession(db, user_id, 'in_menu');
	} catch (err) {
		console.error('LOGIN_SESSION_ERROR', err.message || err, 'onUserLogin');
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
		const lastUserSession = await getLastUserSession(db, user_id);
		if (lastUserSession && lastUserSession.state !== 'logout') {
			await addUserSessionToDB(db, { user_id, state: 'logout' });
		}
	} catch (err) {
		console.error('LOGOUT_SESSION_ERROR', err.message || err, 'onUserLogout');
	}
}

export async function setUserSession(db, user_id, state) {
	try {
		const allowedStates = ['in_menu', 'in_lobby', 'in_game'];
		const lastUserSession = await getLastUserSession(db, user_id);
		if (lastUserSession && lastUserSession.state !== 'logout' && lastUserSession.state !== state) {
			if (allowedStates.includes(state)) {
				await addUserSessionToDB(db, { user_id, state });
			}
		}
	} catch (err) {
		console.error('LOBBY_SESSION_ERROR', err.message || err, 'setUserInLobby');
	}
}
