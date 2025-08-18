import { Game } from '../script.js'
import * as S from '../structs.js'

export function renderMatchInfo(msg: any)
{
	const matchList = document.getElementById('matchList');
	if (!matchList)
		return;
	const matches = msg.matches_array;
	for (let match of matches) {
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
	dashboard.style.height = '70vh';
	dashboard.style.borderRadius = '16px';
	dashboard.style.position = 'relative';
	dashboard.style.boxSizing = 'border-box';
	dashboard.style.alignItems = 'flex-start';

	const title = document.createElement('div');
	title.id = 'dashboardTitle';
	title.textContent = 'Match History';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.fontSize = 'min(5vw, 5vh)';
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
	headers.style.width = "95%";
	headers.style.justifyContent = 'space-between';
	headers.style.alignContent = 'center';
	headers.style.alignItems = 'center';
	headers.style.fontSize = 'min(1.5vw, 2vh)'
	headers.style.fontFamily = '"Horizon", monospace';
	headers.style.color = 'white';
	headers.style.paddingLeft = '2%';
	headers.style.paddingTop = '1%';
	headers.style.paddingBottom = '1%';

	const labels = ['Opponents', 'Date', 'Winner', 'Score', 'Duration', 'Total Hits'];
	labels.forEach(text => {
	const headerItem = document.createElement('div');
		headerItem.textContent = text;
		headerItem.style.flex = '1';
		headers.style.textAlign = 'center';
		headers.appendChild(headerItem);
	})

	// const currentUser = receiveMatchData();

	// const currentUser = {
	// 	username: 'PlayerOne',
	// 	matches: [
	// 		{ opponent: 'PlayerTwo', date: '2025-08-10', score: '3-2', duration: '5m 24s', totalHits: 45 },
	// 		{ opponent: 'BossMan', date: '2025-08-12', score: '1-5', duration: '8m 11s', totalHits: 30 },
	// 		{ opponent: 'LazyFriend', date: '2025-08-14', score: '4-4', duration: '10m 11s', totalHits: 60 },
	// 	]
	// };

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

	// currentUser.matches.forEach(match =>{
	// 	const row = document.createElement('div');
	// 	row.style.display = 'flex';
	// 	row.style.position = 'relative';
	// 	row.style.width = '100%';
	// 	row.style.height = '5%';
	// 	row.style.background = 'rgba(0, 0, 0, 0.18)';
	// 	row.style.cursor = 'point';
	// 	row.style.borderRadius = '10px';
	// 	row.style.justifyContent = 'space-around';
	// 	row.style.alignItems = 'center';
	// 	row.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

	// 	[match.opponent, match.date, match.score, match.duration, match.totalHits].forEach(cell => {
	// 		const cellDiv = document.createElement('div');
	// 		cellDiv.textContent = String(cell);
	// 		cellDiv.style.color = 'white';
	// 		cellDiv.style.textAlign = 'center';
	// 		cellDiv.style.flex = '1';
	// 		row.appendChild(cellDiv);
	// 	});

	// 	row.addEventListener('click', () => {
	// 		alert(`Match vs ${match.opponent} on ${match.date}`);
	// 	});
	// 	matchList.appendChild(row);
	// });

	dashboard.appendChild(headers);
	dashboard.appendChild(matchList);
	containerDashboard.appendChild(title);
	containerDashboard.appendChild(dashboard);
	body.append(containerDashboard);
	const msg = {action: 'matchInfo', subaction: 'getMatchData'};
	Game.socket.send(JSON.stringify(msg));
}
