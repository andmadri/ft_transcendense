export function showTournamentScreen(tournamentState: any) {
	const body = document.getElementById('body');
	if (!body) return;
	body.innerHTML = '';

	const container = document.createElement('div');
	container.id = 'tournamentScreen';
	container.style.padding = '30px';
	container.style.background = '#fffbe6';

	const title = document.createElement('h2');
	title.textContent = 'Tournament Bracket';
	container.appendChild(title);

	// Show players
	const playersDiv = document.createElement('div');
	playersDiv.textContent = 'Players: ' + (tournamentState.players?.map((p: any) => p.name).join(', ') || 'Waiting...');
	playersDiv.style.marginBottom = '20px';
	container.appendChild(playersDiv);

	// Bracket visualization
	const bracketDiv = document.createElement('div');
	bracketDiv.style.display = 'flex';
	bracketDiv.style.flexDirection = 'column';
	bracketDiv.style.gap = '20px';

	// Helper to get player name by ID
	const getName = (id: number) =>
		tournamentState.players?.find((p: any) => p.id === id)?.name || 'TBD';

	// Game 1 & 2
	const g1 = tournamentState.matches?.find((m: any) => m.matchNumber === 1);
	const g2 = tournamentState.matches?.find((m: any) => m.matchNumber === 2);
	const g3 = tournamentState.matches?.find((m: any) => m.matchNumber === 3);
	const g4 = tournamentState.matches?.find((m: any) => m.matchNumber === 4);

	const matchRow = (label: string, m: any) => {
		const row = document.createElement('div');
		row.textContent = `${label}: ${getName(m?.player1)} vs ${getName(m?.player2)} ` +
			(m?.finished ? `(Winner: ${getName(m?.winner)})` : (m?.started ? '(In Progress)' : '(Waiting)'));
		return row;
	};

	bracketDiv.appendChild(matchRow('Game 1', g1));
	bracketDiv.appendChild(matchRow('Game 2', g2));
	bracketDiv.appendChild(matchRow('Game 3 (Losers)', g3));
	bracketDiv.appendChild(matchRow('Game 4 (Final)', g4));

	container.appendChild(bracketDiv);

	// Tournament state message
	const stateMsg = document.createElement('div');
	stateMsg.style.marginTop = '30px';
	stateMsg.style.fontWeight = 'bold';
	if (tournamentState.state === 'waiting') {
		stateMsg.textContent = 'Waiting for players...';
	} else if (tournamentState.state === 'in_progress') {
		stateMsg.textContent = 'Tournament in progress!';
	} else if (tournamentState.state === 'finished') {
		stateMsg.textContent = 'Tournament finished!';
	}
	container.appendChild(stateMsg);

	body.appendChild(container);
}