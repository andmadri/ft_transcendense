

export function renderUserStatsCard(stats: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'statsCard';
	card.style.borderRadius = '16px';
	card.style.background = '#363430';
	card.style.flex = '1 1 50%';
	card.style.padding = '1rem';

	const title = document.createElement('div');
	title.id = 'userStatsTitle';
	title.textContent = 'User Stats';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.whiteSpace = 'nowrap';
	// title.style.display = 'inline-block';
	// title.style.background = '#363430';;
	title.style.textAlign = 'left';
	// title.style.borderRadius = '16px';
	title.style.padding = '0.5rem';
	// title.style.boxSizing = 'border-box';
	title.style.fontSize = 'clamp(18px, 2.5vw, 26px)';

	const titleContainer = document.createElement('div');
	titleContainer.style.display = 'grid';
	titleContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
	// titleContainer.style.padding = '0 1rem'; // same padding as headers
	titleContainer.appendChild(title);

	card.appendChild(titleContainer);

	const headers = document.createElement('div');
	headers.id = 'userStatsHeaders';
	headers.style.display = 'grid';
	headers.style.gridTemplateColumns = 'repeat(4, 1fr)';
	headers.style.textAlign = 'center';
	headers.style.fontSize = 'clamp(6px, 1vw, 12px)';
	headers.style.fontFamily = '"Horizon", monospace';
	headers.style.color = 'white';
	headers.style.padding = '0.7% 0.5rem';
	headers.style.whiteSpace = 'nowrap';

	const labels = ['WINS', 'LOSSES', 'MATCHES', 'AVG DURATION'];

	labels.forEach(label => {
		const headerItem = document.createElement('div');
		headerItem.textContent = label;
		headers.appendChild(headerItem);
	});

	const userStats = document.createElement('div');
	userStats.id = 'userStatsInfo';
	userStats.style.display = 'grid';
	userStats.style.gridTemplateColumns = 'repeat(4, 1fr)';
	userStats.style.textAlign = 'center';
	userStats.style.fontSize = 'clamp(8px, 2vw, 19px)';
	userStats.style.fontFamily = '"RobotoCondensed", monospace';
	userStats.style.color = 'white';
	userStats.style.padding = '0.7% 1rem';
	userStats.style.whiteSpace = 'nowrap';

	const statsInfo = [`${stats.wins}`, `${stats.losses}`, `${stats.total_matches}`, `${stats.avg_duration}`];

	statsInfo.forEach(value => {
		const statsInfoItem = document.createElement('div');
		statsInfoItem.textContent = value;
		userStats.appendChild(statsInfoItem);
	});

	const barContainer = document.createElement('div');
	barContainer.style.marginTop = '1rem';
	barContainer.style.width = '100%';
	barContainer.style.height = '20px';
	barContainer.style.borderRadius = '10px';
	barContainer.style.overflow = 'hidden';
	barContainer.style.background = '#222';
	barContainer.style.fontFamily = '"RobotoCondensed", sans-serif';
	barContainer.style.fontSize = 'clamp(8px, 2vw, 19px)';

	const winBar = document.createElement('div');
	winBar.style.height = '100%';
	winBar.style.float = 'left';
	winBar.style.background = '#4caf50'; // green
	const lossBar = document.createElement('div');
	lossBar.style.height = '100%';
	lossBar.style.float = 'left';
	lossBar.style.background = '#f44336'; // red

	const total = stats.wins + stats.losses;
	const winPct = total > 0 ? (stats.wins / total) * 100 : 0;
	const lossPct = total > 0 ? (stats.losses / total) * 100 : 0;

	winBar.textContent = stats.wins > 0 ? `${winPct.toFixed(0)}%` : '';
	winBar.style.textAlign = 'left';
	lossBar.textContent = stats.losses > 0 ? `${lossPct.toFixed(0)}%` : '';
	lossBar.style.textAlign = 'right';
	winBar.style.width = winPct + "%";
	lossBar.style.width = lossPct + "%";

	barContainer.appendChild(winBar);
	barContainer.appendChild(lossBar);
	
	card.appendChild(headers);
	card.appendChild(userStats);
	card.appendChild(barContainer);
	infoCardsContainer.appendChild(card);
}
