import { log } from '../logging.js'
import { UI, Game } from "../gameData.js"
import * as S from '../structs.js'

export async function submitLogout(e: Event | null, player: number) {
	log(`Submitting logout for player ${player}`);
	if (e)
		e.preventDefault();

	const playerNr = player || 1;
	const payload = { playerNr };
	if (playerNr == 1 && Game.match.player2.login) {  // Ensure player 2 is logged out too
		log(`Player 2 is logged in, logging out player 2 as well.`);
		submitLogout(null, 2);
	}
	log(`Submitting logout for player ${playerNr}`);
	try {
		const response = await fetch(`https://${S.host}/api/logout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});
		if (response.ok) {
			const data = await response.json();
			log(`Logout successful for player ${playerNr}: ${data.message || ''}`);
			if (playerNr == 1) {
				Game.match.player1.ID = -1;
				Game.match.player1.name = "";
				Game.match.player1.login = false;
				UI.state = S.stateUI.LoginP1;
			} else {
				Game.match.player2.ID = 1;
				Game.match.player2.name = "Guest";
				Game.match.player2.login = false;
			}
		} else {
			log(`Logout failed for player ${playerNr}: ${response.statusText}`);
			const error = await response.json();
			alert(error.message || "Logout failed");
		}
	} catch (err) {
		alert("Network error during authentication");
	}
}
