import { log } from '../logging.js'
import { Game  } from '../script.js'
import * as S from '../structs.js'

export async function submitLogout(e: Event | null, playerNr: number) {
	log(`Submitting logout for playerNr ${playerNr}`);
	if (e)
		e.preventDefault();

	const payload = { playerNr };
	if (playerNr == 1 && Game.player2Login) {  // Ensure player 2 is logged out too
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
			log(`Logout successful for playerNr ${playerNr}: ${data.message || ''}`);
			if (playerNr == 1) {
				Game.player1Id = -1;
				Game.player1Name = "";
				Game.player1Login = false;
				Game.state = S.State.LoginP1;
				document.getElementById('menu')?.remove();
			} else {
				Game.player2Id = 1;
				Game.player2Name = "Guest";
				Game.player2Login = false;
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
