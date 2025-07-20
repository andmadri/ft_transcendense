import { log } from '../logging.js'

export async function submitLogout(e: Event, player: number) {
	e.preventDefault();
	const playerNr = player || 1;
	const payload = { playerNr };
	log(`Submitting logout for player ${playerNr}`);
	try {
		// const response = await fetch('/api/logout', { method: 'POST', body: JSON.stringify(payload), credentials: 'include' });
		const response = await fetch(`https://localhost:8443/api/logout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});
		if (response.ok) {
			const data = await response.json();
			log(`Logout successful for player ${playerNr}: ${data.message || ''}`);
		} else {
			log(`Logout failed for player ${playerNr}: ${response.statusText}`);
			const error = await response.json();
			alert(error.message || "Logout failed");
		}
	} catch (err) {
		alert("Network error during authentication");
	}
}
