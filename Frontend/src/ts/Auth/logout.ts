import { log } from '../logging.js'
import { Game  } from '../script.js'
import * as S from '../structs.js'

export async function submitLogout(e: Event | null, player: number) {
	log(`Submitting logout for player ${player}`);
	if (e)
		e.preventDefault();

	const playerNr = player || 1;
	const payload = { playerNr };
	log(`Submitting logout for player ${playerNr}`);
	try {
		// const response = await fetch('/api/logout', { method: 'POST', body: JSON.stringify(payload), credentials: 'include' });
		const response = await fetch(`https://${S.host}:8443/api/logout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});
		if (response.ok) {
			const data = await response.json();
			log(`Logout successful for player ${playerNr}: ${data.message || ''}`);
			if (playerNr == 1) {
				Game.player1Login = false;
				Game.player1Id = -1;
				Game.player1Name = "";
				Game.state = S.State.LoginP1;
			} else {
				Game.player2Login = false;
				Game.player2Id = -1;
				Game.player2Name = "";
				if (Game.state == S.State.Game)
					Game.state = S.State.End;
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
