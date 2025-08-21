

export function renderUserStatsCard(stats: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'statsCard';
	// card.style.aspectRatio = '4 / 3';
	card.style.borderRadius = '16px';
	card.style.background = '#363430';
	card.style.flex = '1 1 50%';

	const title = document.createElement('div');
	title.id = 'userStatsTitle';
	title.textContent = 'User Stats';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.whiteSpace = 'nowrap';
	title.style.display = 'inline-block';
	title.style.background = '#363430';;
	title.style.borderRadius = '16px';
	title.style.padding = '0.5rem';
	title.style.boxSizing = 'border-box';
	title.style.fontSize = 'min(2.5vw, 2.5vh)';
	card.appendChild(title);

	const headers = document.createElement('div');
	headers.id = 'userStatsHeaders';
	headers.style.display = 'flex';
	headers.style.width = "100%";
	headers.style.justifyContent = 'space-around';
	// headers.style.alignContent = 'center';
	headers.style.alignItems = 'center';
	headers.style.fontSize = 'min(1vw, 1.2vh)'
	headers.style.fontFamily = '"Horizon", monospace';
	headers.style.color = 'white';
	// headers.style.paddingLeft = '2%';
	headers.style.paddingTop = '0.7%';
	headers.style.paddingBottom = '0.7%';
	headers.style.whiteSpace = 'nowrap';
	// headerRow.style.display = 'grid';
	// headerRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
	// headerRow.style.gap = '12px';
	// headerRow.style.alignItems = 'center';
	// headerRow.style.userSelect = 'none';

	const labels = ['WINS', 'LOSSES', 'MATCHES', 'AVG DURATION'];

	labels.forEach(text => {
		const headerItem = document.createElement('div');
		// headerItem.id = text;
		headerItem.textContent = text;
		// headerItem.style.flex = '1';
		// headers.style.textAlign = 'center';
		headers.appendChild(headerItem);
		// headers.style.color = '#ffffff';
		// headers.style.textTransform = 'uppercase';
		// headers.style.letterSpacing = '0.06em';
		// headers.style.fontWeight = '800';
		// headers.style.fontFamily = 'system-ui, sans-serif';
		// headers.style.fontSize = 'clamp(12px, 1.1vw, 16px)';
		// headers.style.textAlign = 'center';
		// headers.style.padding = '6px 8px';
		// headers.style.borderRadius = '10px';
		// headerRow.appendChild(headers);
	});
	card.appendChild(headers);

	infoCardsContainer.appendChild(card);
}
