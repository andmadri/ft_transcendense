import { log } from '../logging.js'
import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'
import { navigateTo } from '../history.js'

export async function submitLogout(e: Event | null, playerNr: number) {
	log(`Submitting logout for playerNr ${playerNr}`);
	if (e)
		e.preventDefault();

	const payload = { playerNr };
	if (playerNr == 1 && UI.user2.ID != 1) {  // Ensure player 2 is logged out too
		console.log(`Player 2 is logged in, logging out player 2 as well.`);
		submitLogout(null, 2);
	}
	console.log(`Submitting logout for player ${playerNr}`);
	try {
		const response = await fetch(`https://${S.host}/api/logout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});
		if (response.ok) {
			const data = await response.json();
			console.log(`Logout successful for playerNr ${playerNr}: ${data.message || ''}`);
			document.getElementById('menu')?.remove();
			Game.socket.disconnect();
			Game.socket.connect();
			// Clear user data
			if (playerNr == 1) {
				UI.user1.ID = -1;
				UI.user1.name = "";
				navigateTo('LoginP1');
			} else {
				UI.user2.ID = 1;
				UI.user2.name = "Guest";
				navigateTo('Menu');
			}
		} else {
			console.error('LOGOUT_FAILED', `Logout failed for player ${playerNr}: ${response.statusText}`, 'submitLogout');
		}
	} catch (err) {
		console.error('NETWORK_ERROR', 'Network error during authentication', 'submitLogout');
	}
}
