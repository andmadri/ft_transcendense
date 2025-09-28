function formatDurationSecs(sec: unknown): string {
	const n = Math.round(Number(sec));
	if (!Number.isFinite(n)) {
		return '';
	}
	if (n < 60) {
		return `${n}s`;
	}
	const m = Math.floor(n / 60);
	const s = n % 60;
	return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function renderUserStatsCard(stats: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'statsCard';
	card.style.borderRadius = '16px';
	card.style.background = '#363430';
	card.style.flex = '1 1 50%';
	card.style.padding = '1rem';
	card.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';

	const title = document.createElement('div');
	title.id = 'userStatsTitle';
	title.textContent = 'User Stats';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.whiteSpace = 'nowrap';
	title.style.textAlign = 'left';
	title.style.padding = '0.5rem';
	title.style.fontSize = 'clamp(18px, 2.5vw, 26px)';

	const titleContainer = document.createElement('div');
	titleContainer.style.display = 'grid';
	titleContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
	titleContainer.appendChild(title);

	card.appendChild(titleContainer);

	const statsGrid = document.createElement('div');
	statsGrid.style.display = 'grid';
	statsGrid.style.gridTemplateAreas = `
		"matchesHeader avgHeader"
		"matches       avg"
		"bar           bar"
		"winsHeader    lossesHeader"
		"wins          losses"
	`;
	statsGrid.style.gridTemplateColumns = '1fr 1fr';
	statsGrid.style.gap = '0.5rem';
	statsGrid.style.textAlign = 'center';
	statsGrid.style.fontSize = 'clamp(8px, 1.5vw, 15px)';
	statsGrid.style.fontFamily = '"RobotoCondensed", monospace';
	statsGrid.style.color = 'white';
	statsGrid.style.padding = '0.7% 1rem';

	const matchesHeader = document.createElement('div');
	matchesHeader.textContent = 'MATCHES';
	matchesHeader.style.gridArea = 'matchesHeader';
	matchesHeader.style.fontFamily = '"Horizon", monospace';
	const matchesValue = document.createElement('div');
	matchesValue.textContent = `${stats.total_matches}`;
	matchesValue.style.fontFamily = '"RobotoCondensed", monospace';
	matchesValue.style.gridArea = 'matches';

	const avgHeader = document.createElement('div');
	avgHeader.textContent = 'AVG DURATION';
	avgHeader.style.gridArea = 'avgHeader';
	avgHeader.style.fontFamily = '"Horizon", monospace';
	const avgValue = document.createElement('div');
	if (!stats.avg_duration) {
		avgValue.textContent = `0 seconds`;
	} else {
		const durationTxt = formatDurationSecs(stats.avg_duration);
		avgValue.textContent = durationTxt;
	}
	avgValue.style.fontFamily = '"RobotoCondensed", monospace';
	avgValue.style.gridArea = 'avg';

	const winsHeader = document.createElement('div');
	winsHeader.textContent = 'WINS';
	winsHeader.style.gridArea = 'winsHeader';
	winsHeader.style.fontFamily = '"Horizon", monospace';
	const winsValue = document.createElement('div');
	winsValue.style.fontFamily = '"RobotoCondensed", monospace';
	winsValue.textContent = `${stats.wins}`;
	winsValue.style.gridArea = 'wins';

	const lossesHeader = document.createElement('div');
	lossesHeader.textContent = 'LOSSES';
	lossesHeader.style.gridArea = 'lossesHeader';
	lossesHeader.style.fontFamily = '"Horizon", monospace';
	const lossesValue = document.createElement('div');
	lossesValue.style.fontFamily = '"RobotoCondensed", monospace';
	lossesValue.textContent = `${stats.losses}`;
	lossesValue.style.gridArea = 'losses';

	
	const barContainer = document.createElement('div');
	barContainer.style.marginTop = '1rem';
	barContainer.style.width = '100%';
	barContainer.style.height = '20px';
	barContainer.style.borderRadius = '10px';
	barContainer.style.overflow = 'hidden';
	barContainer.style.background = '#222';
	barContainer.style.gridArea = 'bar';

	const winBar = document.createElement('div');
	winBar.style.height = '100%';
	winBar.style.float = 'left';
	winBar.style.background = '#4caf50';
	const lossBar = document.createElement('div');
	lossBar.style.height = '100%';
	lossBar.style.float = 'left';
	lossBar.style.background = '#f44336';

	const total = stats.wins + stats.losses;
	const winPct = total > 0 ? (stats.wins / total) * 100 : 0;
	const lossPct = total > 0 ? (stats.losses / total) * 100 : 0;

	winBar.style.width = `${winPct}%`;
	lossBar.style.width = `${lossPct}%`;

	barContainer.appendChild(winBar);
	barContainer.appendChild(lossBar);

	statsGrid.append(
		matchesHeader, avgHeader,
		matchesValue, avgValue,
		barContainer,
		winsHeader, lossesHeader,
		winsValue, lossesValue
	);

	card.appendChild(statsGrid);
	infoCardsContainer.appendChild(card);
}
