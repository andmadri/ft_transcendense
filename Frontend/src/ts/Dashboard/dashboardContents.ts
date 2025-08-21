import { Game } from '../script.js'
import * as S from '../structs.js'
// import { renderPie } from './pie'
import { renderPlayingTimeCard } from './playingTime'
import { renderUserStatsCard } from './userStats'

function renderMatchInfo(matches: any, matchList: HTMLElement)
{
	for (let match of matches) {
		const row = document.createElement('div');
		row.style.display = 'flex';
		row.style.position = 'relative';
		row.style.width = '100%';
		row.style.height = '5%';
		row.style.background = 'rgba(0, 0, 0, 0.18)';
		row.style.cursor = 'point';
		row.style.borderRadius = '10px';
		row.style.justifyContent = 'space-between';
		row.style.alignItems = 'center';
		row.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

		let score_match = `${match.my_score} - ${match.opp_score}`;
		//duration should be in seconds and also minutes
		[match.opponent, match.date, match.winner, score_match, match.duration, match.totalHits].forEach(cell => {
			const cellDiv = document.createElement('div');
			cellDiv.textContent = String(cell);
			cellDiv.style.color = 'white';
			cellDiv.style.textAlign = 'center';
			cellDiv.style.flex = '1';
			row.appendChild(cellDiv);
		});
		row.addEventListener('click', () => {
		alert(`Match vs ${match.opponent} on ${match.date}`);
		});
		matchList.appendChild(row);
	}
}

function renderUserInfoCard(user_info: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'userInfoCard';
	// card.style.aspectRatio = '4 / 3';
	card.style.borderRadius = '16px';
	card.style.display = 'flex';
	card.style.background = '#363430';
	card.style.flex = '1 1 25%';
	card.style.flexDirection = 'column';
	card.style.gap = '1rem'
	card.style.alignItems = 'center';  // Center contents horizontally
	card.style.justifyContent = 'center'; 

	const userPic = document.createElement('img')
	userPic.src = `/api/avatar/${user_info.user_id}`;
	userPic.style.width = '30%';
	userPic.style.maxWidth = '100px';
	userPic.style.height = 'auto';
	userPic.style.objectFit = 'cover';
	userPic.style.borderRadius = '50%';

	const userName = document.createElement('div');
	userName.textContent = `${user_info.name}`;
	userName.style.display = 'inline-flex';
	userName.style.color = 'white';
	userName.style.fontSize = 'min(2vw, 2.5vh)';
	userName.style.fontFamily = '"Horizon", sans-serif';
	userName.style.whiteSpace = 'nowrap';

	const userDateCreation = document.createElement('div');
	userDateCreation.style.color = 'white';
	userDateCreation.style.fontSize = 'min(1vw, 1.5vh)';
	userDateCreation.textContent = `Created at: ${user_info.created_at}`;
	userDateCreation.style.display = 'inline-flex';
	userDateCreation.style.fontFamily = '"RobotoCondensed", sans-serif';
	userDateCreation.style.paddingBottom = '1rem';

	card.appendChild(userPic);
	card.appendChild(userName);
	card.appendChild(userDateCreation);
	infoCardsContainer.appendChild(card);
}



// function renderPlayingTimeCard(user_playing_time: any, infoCardsContainer: HTMLElement)
// {
// 	const card = document.createElement('div');
// 	card.id = 'playingTimeCard';
// 	card.style.borderRadius = '16px';
// 	card.style.background = '#363430';
// 	card.style.flex = '1 1 50%';
	

// 	const cardTitle = document.createElement('div');
// 	cardTitle.textContent = 'Playing Time';
// 	cardTitle.style.display = 'inline-flex';
// 	cardTitle.style.alignItems = 'center';
// 	cardTitle.style.justifyContent = 'center';
// 	cardTitle.style.fontSize = 'min(2vw, 2.5vh)';
// 	cardTitle.style.webkitTextStroke = '0.1rem #ffffff';
// 	cardTitle.style.whiteSpace = 'nowrap';
// }

// function formatTotalMinsLabel(secs: number): string
// {
// 	return `${Math.round(secs / 60)}m`;
// }

// export function renderPlayingTimeCard(user_playing_time: any, infoCardsContainer: HTMLElement) {
// 	// Card shell
// 	const card = document.createElement('div');
// 	card.style.aspectRatio = '4 / 3';
// 	card.style.borderRadius = '16px';
// 	card.style.background = '#363430';
// 	card.style.padding = '16px';
// 	card.style.display = 'grid';
// 	card.style.gridTemplateRows = 'auto 1fr auto';
// 	card.style.gap = '1rem';
// 	card.style.justifyContent = 'center';
// 	card.style.alignItems = 'center';

// 	// Title
// 	const cardTitle = document.createElement('div');
// 	cardTitle.textContent = 'Playing Time';
// 	cardTitle.style.color = 'transparent';
// 	cardTitle.style.fontFamily = 'Horizon, sans-serif';
// 	cardTitle.style.whiteSpace = 'nowrap';
// 	cardTitle.style.fontSize = 'min(2vw, 2.5vh)';
// 	cardTitle.style.display = 'inline-flex';
// 	cardTitle.style.webkitTextStroke = '0.1rem #ffffff';
// 	cardTitle.style.textAlign = 'center';  // Center the title
// 	cardTitle.style.paddingBottom = '1rem';
// 	card.appendChild(cardTitle);

// 	// Chart container
// 	const chartWrap = document.createElement('div');
// 	chartWrap.style.width = '70%';
// 	card.appendChild(chartWrap);

// 	// Footer (total time)
// 	const total = document.createElement('div');
// 	total.textContent = `Total time: ${formatTotalMinsLabel(user_playing_time.login_secs)}`;
// 	total.style.color = 'white';
// 	total.style.fontFamily = '"RobotoCondensed", sans-serif';
// 	total.style.fontSize = 'min(1vw, 1.2vh)';
// 	total.style.textAlign = 'center';  // Center the footer text
// 	card.appendChild(total);

// 	// Build data for the pie chart
// 	const parts = [
// 		{ label: 'Menu', value: user_playing_time.menu_secs, className: 'slice--menu', color: '#f59e0b' },
// 		{ label: 'Lobby', value: user_playing_time.lobby_secs, className: 'slice--lobby', color: '#fb923c' },
// 		{ label: 'Game', value: user_playing_time.game_secs, className: 'slice--game', color: '#f97316' },
// 	];

// 	const aria = `Playing time: Menu ${Math.round(100 * parts[0].value / (parts.reduce((s, p) => s + p.value, 0) || 1))}%, ` +
// 		`Lobby ${Math.round(100 * parts[1].value / (parts.reduce((s, p) => s + p.value, 0) || 1))}%, ` +
// 		`Game ${Math.round(100 * parts[2].value / (parts.reduce((s, p) => s + p.value, 0) || 1))}%`;

// 	renderPie(chartWrap, parts, {
// 		totalText: formatTotalMinsLabel(user_playing_time.login_secs),
// 		ariaLabel: aria,
// 		radius: 36,
// 		thickness: 18,
// 		startAngleDeg: -90
// 	});

// 	// Append the card to the container
// 	infoCardsContainer.appendChild(card);
// }


export function populateDashboard(msg: any)
{
	const matchList = document.getElementById('matchList');
	const infoCardsContainer = document.getElementById('infoCardsContainer');
	if (!infoCardsContainer || !matchList)
		return ;
	renderMatchInfo(msg.matches, matchList);
	renderUserInfoCard(msg.player, infoCardsContainer);
	renderUserStatsCard(msg.stats, infoCardsContainer);
	renderPlayingTimeCard(msg.log_time, infoCardsContainer);
}

export function getDashboard()
{
	const menu = document.getElementById('menu');
	if(menu)
		menu.remove();
	const optionMenu = document.getElementById('optionMenu');
	if (optionMenu)
		optionMenu.remove();

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';

	const containerDashboard = document.createElement('div');
	containerDashboard.style.display = 'flex';
	containerDashboard.style.flexDirection = 'column';
	containerDashboard.id = 'containerDashboard';
	containerDashboard.style.width = '100%';
	containerDashboard.style.height = '100%';
	containerDashboard.style.position = 'relative';
	containerDashboard.style.alignItems = 'center';
	containerDashboard.style.justifyContent = 'center';
	containerDashboard.style.gap = '1.5%';

	const dashboard = document.createElement('div');
	dashboard.id = 'dashboard';
	dashboard.style.background = '#363430';
	dashboard.style.display = 'flex';
	dashboard.style.flexDirection = 'column';
	dashboard.style.aspectRatio = '4 / 3';
	dashboard.style.width = '80vw';
	dashboard.style.height = '50vh';
	dashboard.style.borderRadius = '16px';
	dashboard.style.position = 'relative';
	dashboard.style.boxSizing = 'border-box';
	dashboard.style.alignItems = 'flex-start';

	const title = document.createElement('div');
	title.id = 'dashboardTitle';
	title.textContent = 'Match History';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.fontSize = 'min(3vw, 3vh)';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.whiteSpace = 'nowrap';
	title.style.display = 'inline-block';
	title.style.background = '#363430';;
	title.style.borderRadius = '16px';
	title.style.width = '80vw';
	title.style.padding = '0.5rem';
	title.style.boxSizing = 'border-box';

	const headers = document.createElement('div');
	headers.id = 'dashboardHeaders';
	headers.style.display = 'flex';
	headers.style.width = "100%";
	headers.style.justifyContent = 'space-between';
	headers.style.alignContent = 'center';
	headers.style.alignItems = 'center';
	headers.style.fontSize = 'min(1.2vw, 1.4vh)'
	headers.style.fontFamily = '"Horizon", monospace';
	headers.style.color = 'white';
	// headers.style.paddingLeft = '2%';
	headers.style.paddingTop = '0.7%';
	headers.style.paddingBottom = '0.7%';
	headers.style.whiteSpace = 'nowrap';

	const labels = ['Opponent', 'Date', 'Winner', 'Score', 'Duration', 'Total Hits'];
	labels.forEach(text => {
	const headerItem = document.createElement('div');
		headerItem.textContent = text;
		headerItem.style.flex = '1';
		headers.style.textAlign = 'center';
		headers.appendChild(headerItem);
	})

	// const currentUser = receiveMatchData();

	const currentUser = {
		username: 'PlayerOne',
		matches: [
			{ opponent: 'PlayerTwo', date: '2025-08-10', score: '3-2', duration: '5m 24s', totalHits: 45 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'PlayerTwo', date: '2025-08-10', score: '3-2', duration: '5m 24s', totalHits: 45 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
			{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
			{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
		]
	};

	const matchList = document.createElement('div');
	matchList.id = 'matchList';
	matchList.style.display = 'flex';
	matchList.style.flexDirection = 'column';
	matchList.style.width = '95%';
	matchList.style.gap = '1rem';
	matchList.style.overflowY = 'auto';
	matchList.style.flexGrow = '1';
	matchList.style.paddingLeft = '2%';
	matchList.style.fontFamily = '"RobotoCondensed", sans-serif';
	matchList.style.fontSize = 'min(2vw, 2vh)';
	matchList.style.textAlign = 'center';

	currentUser.matches.forEach(match =>{
		const row = document.createElement('div');
		row.style.display = 'flex';
		row.style.position = 'relative';
		row.style.width = '100%';
		row.style.height = '5%';
		row.style.background = 'rgba(0, 0, 0, 0.18)';
		row.style.cursor = 'point';
		row.style.borderRadius = '10px';
		row.style.justifyContent = 'space-around';
		row.style.alignItems = 'center';
		row.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

		[match.opponent, match.date, match.score, match.duration, match.totalHits].forEach(cell => {
			const cellDiv = document.createElement('div');
			cellDiv.textContent = String(cell);
			cellDiv.style.color = 'white';
			cellDiv.style.textAlign = 'center';
			cellDiv.style.flex = '1';
			row.appendChild(cellDiv);
		});

		row.addEventListener('click', () => {
			alert(`Match vs ${match.opponent} on ${match.date}`);
		});
		matchList.appendChild(row);
	});

	const infoCardsContainer = document.createElement('div');
	infoCardsContainer.id = 'infoCardsContainer';
	infoCardsContainer.style.display = 'flex';
	infoCardsContainer.style.direction = 'row';
	infoCardsContainer.style.width = '80vw';
	infoCardsContainer.style.height = '25vh';
	infoCardsContainer.style.justifyContent = 'space-between';
	infoCardsContainer.style.background = 'transparent';
	infoCardsContainer.style.gap = '1rem';
	infoCardsContainer.style.aspectRatio = '3/4';

	dashboard.appendChild(headers);
	dashboard.appendChild(matchList);
	containerDashboard.appendChild(infoCardsContainer);
	containerDashboard.appendChild(title);
	containerDashboard.appendChild(dashboard);
	body.append(containerDashboard);
	const msg = {action: 'dashboard', subaction: 'getFullDataDashboard'};
	Game.socket.send(JSON.stringify(msg));
}
