

export function renderPlayingTimeCard(user_playing_time: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'PlayerGameTime';
	card.style.borderRadius = '16px';
	card.style.display = 'flex';
	card.style.background = '#363430';
	card.style.flex = '1 1 25%';
	card.style.flexDirection = 'column';
	card.style.gap = '1rem';

	const title = document.createElement('div');
	title.id = 'playingTimeTitle';
	title.textContent = 'Playing Time';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.display = 'inline-block';
	title.style.background = '#363430';;
	title.style.borderRadius = '16px';
	title.style.padding = '0.5rem';
	title.style.boxSizing = 'border-box';
	title.style.fontSize = 'clamp(18px, 2.5vw, 30px)';
	card.appendChild(title);

	// ===== Block where the donut will be placed ============================
	const stage = document.createElement('div');
	stage.id = "stage";
	stage.style.width = '100%';
	stage.style.height = '100%';
	stage.style.position = 'relative';
	stage.style.display = 'grid';
	stage.style.placeItems = 'center';
	stage.style.overflow = 'hidden';
	card.appendChild(stage);

	// ===== Wrapper for the donut, keeps donut centered ============================
	const wrapper = document.createElement('div');
	wrapper.id = "wrapper";
	wrapper.style.width = '100%';
	wrapper.style.height = '100%';
	wrapper.style.position = 'relative';
	wrapper.style.display = 'grid';
	wrapper.style.placeItems = 'center';
	wrapper.style.overflow = 'hidden';
	stage.appendChild(wrapper);

	// ===== Square, the pie chart itself ============================
	const square = document.createElement('div');
	square.id = 'donutSquare';
	square.style.position = 'relative';
	square.style.boxSizing = 'border-box';
	square.style.borderRadius = '50%';
	square.style.inlineSize = 'var(--size, 0px)'; // width from ResizeObserver
	square.style.blockSize = 'var(--size, 0px)'; // width from ResizeObserver
	wrapper.appendChild(square);

	// Calculate the data for the pie chart
	const total = Math.max(
		0,
		Number(user_playing_time.game_secs) +
		Number(user_playing_time.lobby_secs) +
		Number(user_playing_time.menu_secs)
	);
	const pct = (n: number) => (total ? (n / total) * 100 : 0);

	const gamePct = pct(user_playing_time.game_secs);
	const lobbyPct = pct(user_playing_time.lobby_secs);
	const menuPct = Math.max(0, 100 - gamePct - lobbyPct);
	const gameColor = '#f96216ff';
	const lobbyColor = '#f99716ff';
	const menuColor = '#f9d716ff';
	const stop1 = gamePct;
	const stop2 = gamePct + lobbyPct;

	// Game -> Lobby -> Menu, start at 12 o’clock
	square.style.background = `conic-gradient(
		${gameColor} 0% ${stop1}%,
		${lobbyColor} ${stop1}% ${stop2}%,
		${menuColor} ${stop2}% 100%
	)`;

	// ===== Donut hole =========================================
	const hole = document.createElement('div');
	hole.id = 'donutHole';
	hole.style.position = 'relative';
	hole.style.boxSizing = 'border-box';
	hole.style.borderRadius = '50%';
	hole.style.inlineSize = '65%';
	hole.style.blockSize = '65%';
	hole.style.left = '50%';
	hole.style.top = '50%';
	hole.style.transform = 'translate(-50%, -50%)';
	hole.style.aspectRatio = '1 / 1';
	hole.style.background = getComputedStyle(card).backgroundColor || '#363430';
	hole.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.06)';
	hole.style.display = 'grid';
	hole.style.placeItems = 'center';
	hole.style.textAlign = 'center';
	hole.style.pointerEvents = 'none';
	square.appendChild(hole);

	// ===== Wrapper for text in the middle of the donut =========================================
	const labelWrap = document.createElement('div');
	labelWrap.id = 'labelWrap';
	labelWrap.style.color = '#ffffff';
	labelWrap.style.fontFamily = 'RobotoCondensed, sans-serif';
	labelWrap.style.lineHeight = '1.1';

	// ===== "Total" text in the middle of the donut =========================================
	const smallTotal = document.createElement('div');
	smallTotal.id = 'smallTotal';
	smallTotal.textContent = 'Total';
	smallTotal.style.fontSize = '10px';
	smallTotal.style.opacity = '0.8';

	// ===== "'x'm" text in the middle of the donut =========================================
	const bigGameTime = document.createElement('div');
	bigGameTime.id = 'bigGameTime';
	bigGameTime.textContent = `${Math.round(Number(user_playing_time.login_secs) / 60)}m`;
	bigGameTime.style.fontSize = '16px';
	bigGameTime.style.fontWeight = '800';

	labelWrap.appendChild(smallTotal);
	labelWrap.appendChild(bigGameTime);
	hole.appendChild(labelWrap);
	square.appendChild(hole);

	// ===== Legend ===============================================
	const slices = [
		{ name: 'Game',  color: gameColor, pct: gamePct  },
		{ name: 'Lobby', color: lobbyColor, pct: lobbyPct },
		{ name: 'Menu',  color: menuColor, pct: menuPct  },
	].filter(s => s.pct > 0.001);

	const legend = document.createElement('div');
	legend.id = 'legend';
	legend.style.display = 'flex';
	legend.style.justifyContent = 'center';
	legend.style.alignItems = 'center';
	legend.style.gap = '0.5rem';
	legend.style.flexWrap = 'wrap';
	legend.style.padding = '0px 0px 8px';
	legend.style.color = 'white';
	legend.style.fontFamily = 'RobotoCondensed-ui, sans-serif';
	legend.style.fontSize = 'clamp(8px, 1vw, 12px)';
	legend.style.textAlign = 'center';

	slices.forEach(s => {
		const item = document.createElement('div');
		Object.assign(item.style, { display: 'flex', alignItems: 'center', gap: '6px' } as CSSStyleDeclaration);

		const dot = document.createElement('span');
		Object.assign(dot.style, {
			width: '10px',
			height: '10px',
			borderRadius: '50%',
			background: s.color,
			display: 'inline-block',
		} as CSSStyleDeclaration);

		const label = document.createElement('span');
		label.textContent = `${s.name} ${Math.round(s.pct)}%`;

		item.appendChild(dot);
		item.appendChild(label);
		legend.appendChild(item);
	});

	card.appendChild(legend);

	// ===== Keep the donut perfectly inside the stage =========================
	const MARGIN = 8; // px gap from the stage edges
	function layoutSquare() {
		const r = stage.getBoundingClientRect();
		const size = Math.max(0, Math.min(r.width, r.height) - MARGIN * 2);
		square.style.setProperty('--size', `${size}px`);
	}
	const ro = new ResizeObserver(layoutSquare);
	ro.observe(stage);
	layoutSquare();

	// ===== Mount it in the dashboard =========================
	infoCardsContainer.appendChild(card);
}
