

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
	// title.style.position = 'relative';
	card.appendChild(title);

	// ===== Stage (middle row) keeps donut centered ============================
	const stage = document.createElement('div');
	Object.assign(stage.style, {
		width: '100%',
		height: '100%',
		position: 'relative',
		display: 'grid',
		placeItems: 'center',
		overflow: 'hidden', // never let children overflow the card
	} as CSSStyleDeclaration);
	card.appendChild(stage);

	// Wrapper + square (the donut background)
	const wrapper = document.createElement('div');
	Object.assign(wrapper.style, {
		position: 'relative',
		display: 'grid',
		placeItems: 'center',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
	} as CSSStyleDeclaration);
	stage.appendChild(wrapper);

	const square = document.createElement('div');
	square.id = 'donutSquare';
	Object.assign(square.style, {
		position: 'relative',
		boxSizing: 'border-box',
		borderRadius: '50%',
		inlineSize: 'var(--size, 0px)',   // width from ResizeObserver
		blockSize: 'var(--size, 0px)',    // height from ResizeObserver
	} as CSSStyleDeclaration);
	wrapper.appendChild(square);

	// const { game_secs, lobby_secs, menu_secs } = user_playing_time;

	// const total = Math.max(0, Number(game_secs) + Number(lobby_secs) + Number(menu_secs));
	// const toPct = (n: number) => (total > 0 ? (n / total) * 100 : 0); // Round this to 0 decimals!

	// const GAME_PCT  = toPct(game_secs);
	// const LOBBY_PCT = toPct(lobby_secs);
	// const MENU_PCT  = Math.max(0, 100 - GAME_PCT - LOBBY_PCT);


	// console.table({ GAME_PCT, LOBBY_PCT, MENU_PCT, total });

	// // --- hardcoded percentages (must add up to 100)
	// // const GAME_PCT  = 75;  // 75%
	// // const LOBBY_PCT = 0;   // 0% (invisible slice)
	// // const MENU_PCT  = 25;  // 25%

	// // cumulative stops
	// const stop1 = GAME_PCT;                 // end of Game
	// const stop2 = GAME_PCT + LOBBY_PCT;     // end of Lobby
	// // Menu runs from stop2 to 100%

	// square.style.background = `conic-gradient(
	// 	#ff0400ff 0% ${stop1}% ,		/* Game  // OPTIMIZE THIS!*/
	// 	#fb923c ${stop1}% ${stop2}% ,	/* Lobby (0% here, so it vanishes)  // OPTIMIZE THIS!*/
	// 	#0031f3ff ${stop2}% 100%		/* Menu  // OPTIMIZE THIS!*/
	// )`;

	// /*
	// conic-gradient(
	// 	rgb(255, 4, 0) 65%,
	// 	rgb(251, 146, 60) 0 85%,
	// 	rgb(0, 49, 243) 0,
	// */

	// // --- Donut hole overlay
	// square.style.position = 'relative';

	// // thickness of the ring as % of the square’s width
	// const donutThicknessPct = 18;                     // tweak 12–24 to taste
	// const innerSize = `${100 - 2 * donutThicknessPct}%`;

	// // // match the card background so it looks cut out
	// // const cardBg = getComputedStyle(infoCardsContainer).backgroundColor || '#363430';

	// const hole = document.createElement('div');
	// hole.id = 'hole';
	// Object.assign(hole.style, {
	// 	position: 'absolute',
	// 	left: '50%',
	// 	top: '50%',
	// 	transform: 'translate(-50%, -50%)',
	// 	width: innerSize,
	// 	aspectRatio: '1 / 1',
	// 	borderRadius: '50%',
	// 	background: '#363430', // cardBg,
	// 	// subtle inner edge so the ring reads crisply
	// 	boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
	// } as CSSStyleDeclaration);


	// // Function to show the total time in the donut
	// function formatDuration(secs: number): string {
	// 	const mins = Math.round(secs / 60);
	// 	if (mins < 60)
	// 		return `${mins}m`;
	// 	const h = Math.floor(mins / 60);
	// 	const m = mins % 60;
	// 	return `${h}h ${m}m`;
	// }

	// // make the hole a centering container
	// Object.assign(hole.style, {
	// 	display: 'flex',
	// 	placeItems: 'center',
	// 	textAlign: 'center',
	// });

	// // wrapper for the two lines
	// const centerLabel = document.createElement('div');
	// centerLabel.id = 'centerLabel';
	// Object.assign(centerLabel.style, {
	// 	color: '#fff',
	// 	lineHeight: '1.1',
	// 	fontFamily: 'system-ui, sans-serif',
	// 	pointerEvents: 'none', // don’t block hover on the donut
	// } as CSSStyleDeclaration);

	// const line1 = document.createElement('div');
	// line1.id = 'line1';
	// line1.textContent = 'Total';
	// Object.assign(line1.style, {
	// 	fontSize: '10px',
	// 	opacity: '0.8',
	// } as CSSStyleDeclaration);

	// const line2 = document.createElement('div');
	// line2.id = 'line2';
	// line2.textContent = formatDuration(user_playing_time.login_secs);
	// Object.assign(line2.style, {
	// 	fontSize: '16px',
	// 	fontWeight: '700',
	// } as CSSStyleDeclaration);

	// centerLabel.appendChild(line1);
	// centerLabel.appendChild(line2);
	// hole.appendChild(centerLabel);

	// square.appendChild(hole);

	// // // --- Chart title (top-left overlay)
	// // const chartTitle = document.createElement('div');
	// // chartTitle.textContent = 'Playing time';
	// // Object.assign(chartTitle.style, {
	// // 	position: 'absolute',
	// // 	top: '10px',
	// // 	left: '12px',
	// // 	color: '#fff',
	// // 	fontFamily: 'system-ui, sans-serif',
	// // 	fontSize: '12px',
	// // 	fontWeight: '700',
	// // 	letterSpacing: '0.02em',
	// // 	textShadow: '0 1px 1px rgba(0,0,0,0.25)',
	// // 	opacity: '0.9',
	// // });
	// // square.appendChild(chartTitle);

	// // --- Legend with value labels (Game → Lobby → Menu)
	// const slices = [
	// 	{ name: 'Game',  color: '#f97316', pct: GAME_PCT }, // OPTIMIZE THIS!
	// 	{ name: 'Lobby', color: '#fb923c', pct: LOBBY_PCT }, // OPTIMIZE THIS!
	// 	{ name: 'Menu',  color: '#f59e0b', pct: MENU_PCT }, // OPTIMIZE THIS!
	// ].filter(s => s.pct > 0.0001); // hide zero slces

	// // container under the square
	// const legend = document.createElement('div');
	// Object.assign(legend.style, {
	// 	marginTop: '12px',
	// 	display: 'flex',
	// 	// gridAutoFlow: 'column',
	// 	// gridAutoColumns: '1fr',
	// 	gap: '8px',
	// 	alignItems: 'center',
	// 	color: '#eee',
	// 	fontFamily: 'system-ui, sans-serif',
	// 	fontSize: '12px',
	// } as CSSStyleDeclaration);

	// // one item per slice
	// slices.forEach(s => {
	// const item = document.createElement('div');
	// Object.assign(item.style, { display: 'flex', alignItems: 'center', gap: '8px' });

	// const dot = document.createElement('span');
	// Object.assign(dot.style, {
	// 	width: '10px',
	// 	height: '10px',
	// 	borderRadius: '50%',
	// 	background: s.color,
	// 	display: 'inline-block'
	// });

	// const label = document.createElement('span');
	// // round to whole %; tweak toFixed(1) if you want 1 decimal
	// label.textContent = `${s.name} ${Math.round(s.pct)}%`;

	// item.appendChild(dot);
	// item.appendChild(label);
	// legend.appendChild(item);
	// });

	// card.appendChild(square);

	// place legend BELOW the square (append to the card, after the stage)
	// card.appendChild(legend);


	  // ===== Data → conic gradient =============================================
  const total = Math.max(
    0,
    Number(user_playing_time.game_secs) +
      Number(user_playing_time.lobby_secs) +
      Number(user_playing_time.menu_secs)
  );
  const pct = (n: number) => (total ? (n / total) * 100 : 0);

  const gamePct = pct(user_playing_time.game_secs);
  const lobbyPct = pct(user_playing_time.lobby_secs);
  const stop1 = gamePct;
  const stop2 = gamePct + lobbyPct;

  // Game → Lobby → Menu, start at 12 o’clock
  square.style.background = `conic-gradient(
    from -90deg,
    #f97316 0% ${stop1}%,
    #fb923c ${stop1}% ${stop2}%,
    #f59e0b ${stop2}% 100%
  )`;

	// ===== Donut hole + center label =========================================
	const hole = document.createElement('div');
	const innerSize = `${100 - 2 * 18}%`; // ring thickness = 18%; tweak as you like
	Object.assign(hole.style, {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		width: innerSize,
		aspectRatio: '1 / 1',
		borderRadius: '50%',
		background: getComputedStyle(card).backgroundColor || '#363430',
		boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
		display: 'grid',
		placeItems: 'center',
		textAlign: 'center',
		pointerEvents: 'none',
	} as CSSStyleDeclaration);

	const labelWrap = document.createElement('div');
	Object.assign(labelWrap.style, {
		color: '#fff',
		fontFamily: 'RobotoCondensed, sans-serif',
		lineHeight: '1.1',
	} as CSSStyleDeclaration);

	const small = document.createElement('div');
	small.textContent = 'Total';
	Object.assign(small.style, { fontSize: '10px', opacity: '0.8' } as CSSStyleDeclaration);

	const big = document.createElement('div');
	big.textContent = `${Math.round(Number(user_playing_time.login_secs) / 60)}m`;
	Object.assign(big.style, { fontSize: '16px', fontWeight: '800' } as CSSStyleDeclaration);

	labelWrap.appendChild(small);
	labelWrap.appendChild(big);
	hole.appendChild(labelWrap);
	square.appendChild(hole);

	// ===== Footer (bottom row) ===============================================
	const footer = document.createElement('div');
	footer.textContent = `Total time: ${Math.round(Number(user_playing_time.login_secs) / 60)}m`;
	Object.assign(footer.style, {
		color: '#ddd',
		fontFamily: 'RobotoCondensed-ui, sans-serif',
		fontSize: '12px',
		marginBottom: '1vw',
		textAlign: 'center'
	} as CSSStyleDeclaration);
	card.appendChild(footer);

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

	// Mount the card
	infoCardsContainer.appendChild(card);


	// infoCardsContainer.appendChild(card);
}


// const wrapper = document.getElementById('wrapperDonut') as HTMLElement;
// const square  = document.getElementById('square') as HTMLElement;
// function layoutDonut() {

// const MARGIN = 8;
// const r = wrapper.getBoundingClientRect();
// const size = Math.max(0, Math.min(r.width, r.height) - MARGIN * 2);
// square.style.width = size + 'px';
// square.style.height = size + 'px';
// }
// const ro = new ResizeObserver(layoutDonut);
// ro.observe(wrapper);
// layoutDonut();