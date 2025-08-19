

export function renderPlayingTimeCard(user_playing_time: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'PlayerGameTime';
	card.style.aspectRatio = '4 / 3';
	card.style.borderRadius = '16px';
	card.style.display = 'flex';
	card.style.background = '#363430';
	card.style.flex = '1 1 50%';
	card.style.flexDirection = 'column';
	card.style.gap = '1rem'
	card.style.alignItems = 'center';  // Center contents horizontally
	card.style.justifyContent = 'center';

	Object.assign(card.style, {
		position: 'relative',
		display: 'grid',
		gridTemplateRows: 'auto 1fr auto',   // title | chart | legend/footer
		padding: '16px',
		overflow: 'hidden',                  // no overflow ever
	} as CSSStyleDeclaration);

	const stage = document.createElement('div');     // fills the middle area
	stage.id = 'stage';
	Object.assign(stage.style, {
		width: '100%',
		height: '100%',
		position: 'relative',
		display: 'grid',
		placeItems: 'center',
		overflow: 'hidden',                  // belt-and-suspenders
	} as CSSStyleDeclaration);
	card.appendChild(stage);
	
	// the visible square we’ll later replace with an <svg>
	const square = document.createElement('div');
	square.id = 'square';
	Object.assign(square.style, {
		position: 'relative',
		boxSizing: 'border-box',
		border: '2px solid rgba(9, 255, 0, 1)',
		// borderRadius: '14px',
		// width: '18vw',									// responsive
		aspectRatio: '1 / 1',							// keep it perfectly square
		// border: '2px solid rgba(9, 255, 0, 1)',
		borderRadius: '50%',
		// background: 'radial-gradient(50% 50% at 50% 50%, #f59e0b 0%, #f97316 60%, #fb923c 100%)',
	} as CSSStyleDeclaration);
	stage.appendChild(square);

	const { game_secs, lobby_secs, menu_secs } = user_playing_time;

	const total = Math.max(0, Number(game_secs) + Number(lobby_secs) + Number(menu_secs));
	const toPct = (n: number) => (total > 0 ? (n / total) * 100 : 0); // Round this to 0 decimals!

	const GAME_PCT  = toPct(game_secs);
	const LOBBY_PCT = toPct(lobby_secs);
	const MENU_PCT  = Math.max(0, 100 - GAME_PCT - LOBBY_PCT);


	console.table({ GAME_PCT, LOBBY_PCT, MENU_PCT, total });

	// --- hardcoded percentages (must add up to 100)
	// const GAME_PCT  = 75;  // 75%
	// const LOBBY_PCT = 0;   // 0% (invisible slice)
	// const MENU_PCT  = 25;  // 25%

	// cumulative stops
	const stop1 = GAME_PCT;                 // end of Game
	const stop2 = GAME_PCT + LOBBY_PCT;     // end of Lobby
	// Menu runs from stop2 to 100%

	square.style.background = `conic-gradient(
		#ff0400ff 0% ${stop1}% ,		/* Game  // OPTIMIZE THIS!*/
		#fb923c ${stop1}% ${stop2}% ,	/* Lobby (0% here, so it vanishes)  // OPTIMIZE THIS!*/
		#0031f3ff ${stop2}% 100%		/* Menu  // OPTIMIZE THIS!*/
	)`;

	/*
	conic-gradient(
		rgb(255, 4, 0) 65%,
		rgb(251, 146, 60) 0 85%,
		rgb(0, 49, 243) 0,
	*/

	// --- Donut hole overlay
	square.style.position = 'relative';

	// thickness of the ring as % of the square’s width
	const donutThicknessPct = 18;                     // tweak 12–24 to taste
	const innerSize = `${100 - 2 * donutThicknessPct}%`;

	// // match the card background so it looks cut out
	// const cardBg = getComputedStyle(infoCardsContainer).backgroundColor || '#363430';

	const hole = document.createElement('div');
	hole.id = 'hole';
	Object.assign(hole.style, {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		width: innerSize,
		aspectRatio: '1 / 1',
		borderRadius: '50%',
		background: '#363430', // cardBg,
		// subtle inner edge so the ring reads crisply
		boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
	} as CSSStyleDeclaration);


	// Function to show the total time in the donut
	function formatDuration(secs: number): string {
		const mins = Math.round(secs / 60);
		if (mins < 60)
			return `${mins}m`;
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		return `${h}h ${m}m`;
	}

	// make the hole a centering container
	Object.assign(hole.style, {
		display: 'grid',
		placeItems: 'center',
		textAlign: 'center',
	});

	// wrapper for the two lines
	const centerLabel = document.createElement('div');
	centerLabel.id = 'centerLabel';
	Object.assign(centerLabel.style, {
		color: '#fff',
		lineHeight: '1.1',
		fontFamily: 'system-ui, sans-serif',
		pointerEvents: 'none', // don’t block hover on the donut
	} as CSSStyleDeclaration);

	const line1 = document.createElement('div');
	line1.id = 'line1';
	line1.textContent = 'Total';
	Object.assign(line1.style, {
		fontSize: '10px',
		opacity: '0.8',
	} as CSSStyleDeclaration);

	const line2 = document.createElement('div');
	line2.id = 'line2';
	line2.textContent = formatDuration(user_playing_time.login_secs);
	Object.assign(line2.style, {
		fontSize: '16px',
		fontWeight: '700',
	} as CSSStyleDeclaration);

	centerLabel.appendChild(line1);
	centerLabel.appendChild(line2);
	hole.appendChild(centerLabel);

	square.appendChild(hole);

	// --- Chart title (top-left overlay)
	const chartTitle = document.createElement('div');
	chartTitle.textContent = 'Playing time';
	Object.assign(chartTitle.style, {
		position: 'absolute',
		top: '10px',
		left: '12px',
		color: '#fff',
		fontFamily: 'system-ui, sans-serif',
		fontSize: '12px',
		fontWeight: '700',
		letterSpacing: '0.02em',
		textShadow: '0 1px 1px rgba(0,0,0,0.25)',
		opacity: '0.9',
	});
	square.appendChild(chartTitle);

	// --- Legend with value labels (Game → Lobby → Menu)
	const slices = [
		{ name: 'Game',  color: '#f97316', pct: GAME_PCT }, // OPTIMIZE THIS!
		{ name: 'Lobby', color: '#fb923c', pct: LOBBY_PCT }, // OPTIMIZE THIS!
		{ name: 'Menu',  color: '#f59e0b', pct: MENU_PCT }, // OPTIMIZE THIS!
	].filter(s => s.pct > 0.0001); // hide zero slces

	// container under the square
	const legend = document.createElement('div');
	Object.assign(legend.style, {
		marginTop: '12px',
		display: 'grid',
		gridAutoFlow: 'column',
		gridAutoColumns: '1fr',
		gap: '8px',
		alignItems: 'center',
		color: '#eee',
		fontFamily: 'system-ui, sans-serif',
		fontSize: '12px',
	} as CSSStyleDeclaration);

	// one item per slice
	slices.forEach(s => {
	const item = document.createElement('div');
	Object.assign(item.style, { display: 'flex', alignItems: 'center', gap: '8px' });

	const dot = document.createElement('span');
	Object.assign(dot.style, {
		width: '10px',
		height: '10px',
		borderRadius: '50%',
		background: s.color,
		display: 'inline-block'
	});

	const label = document.createElement('span');
	// round to whole %; tweak toFixed(1) if you want 1 decimal
	label.textContent = `${s.name} ${Math.round(s.pct)}%`;

	item.appendChild(dot);
	item.appendChild(label);
	legend.appendChild(item);
	});

	card.appendChild(square);

	// place legend BELOW the square (append to the card, after the stage)
	card.appendChild(legend);

	infoCardsContainer.appendChild(card);
}
