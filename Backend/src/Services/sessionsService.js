import { addUserSessionToDB, getLastUserSession } from '../Database/sessions.js'
import { tournament, leaveTournament } from '../Tournament/tournament.js';
import { getOnlineUserByID } from '../Database/users.js';

export async function updatePlayersSessionDB(db, user_ids, state) {
	await Promise.all(user_ids.map(user_id => setUserSession(db, user_id, state)));
}

export async function onUserLogin(db, user_id) {
	try {
		await setUserSession(db, user_id, 'login');
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
		await setUserSession(db, user_id, 'logout');
	} catch (err) {
		console.error('LOGOUT_SESSION_ERROR', err.message || err, 'onUserLogout');
	}
}

export async function setUserSession(db, user_id, state) {
	try {
		const isOnline = await getOnlineUserByID(db, user_id);
		if (state === 'login' && !isOnline) {
			await addUserSessionToDB(db, { user_id, state });
		} else if (state === 'logout' && isOnline) {
			await addUserSessionToDB(db, { user_id, state });
		} else {
			const lastUserSession = await getLastUserSession(db, user_id);
			const allowedStates = ['in_menu', 'in_lobby', 'in_game'];
			if (isOnline && lastUserSession && lastUserSession.state !== state && allowedStates.includes(state)) {
				await addUserSessionToDB(db, { user_id, state });
			}
		}
	} catch (err) {
		console.error('LOBBY_SESSION_ERROR', err.message || err, 'setUserInLobby');
	}
}
