import { addUserSessionToDB } from '../Database/sessions.js'

export async function updatePlayersSessionDB(db, user_ids, state) {
	await Promise.all(
		user_ids.map(user_id => addUserSessionToDB(db, { user_id, state }))
	);
}

/*
1) Update two players userSession using this function: addUserSessionToDB(db, session)
2) Check if the player is online using this function: getLatestSessionByState(db, user_id, state)
3) Give a list of all the players that are online.
*/

export async function onUserLogin(db, user_id) {
	try {
		await addUserSessionToDB(db, { user_id, state: 'login' });
		await addUserSessionToDB(db, { user_id, state: 'in_menu' });
	} catch (err) {
		console.error('AddUserSession: ' + err);
	}
}
