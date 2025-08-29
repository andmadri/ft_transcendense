import { Game, UI } from '../gameData'
import * as S from '../structs.js'
import { renderPlayingTimeCard } from './playingTime'
import { renderUserStatsCard } from './userStats'
import { log } from '../logging.js'
import { navigateTo } from '../history'

function renderMatchInfo(matches: any, matchHistoryList: HTMLElement)
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
		matchHistoryList.appendChild(row);
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
	userPic.src = `/api/avatar/${user_info.id}`;
	//clamped
	userPic.style.height = 'clamp(60px, 30%, 120px)';
	userPic.style.objectFit = 'cover';
	userPic.style.borderRadius = '50%';
	userPic.style.aspectRatio = '1/1';

	const userName = document.createElement('div');
	userName.textContent = `${user_info.name}`;
	userName.style.display = 'inline-flex';
	userName.style.color = 'white';
	//clamped
	userName.style.fontSize = 'clamp(14px, 2vw, 24px)';
	userName.style.fontFamily = '"Horizon", sans-serif';
	userName.style.whiteSpace = 'nowrap';

	const userDateCreation = document.createElement('div');
	userDateCreation.style.color = 'white';
	//clamped
	userDateCreation.style.fontSize = 'clamp(6px, 1vw, 16px)';
	userDateCreation.textContent = `Created at: ${user_info.created_at}`;
	userDateCreation.style.display = 'inline-flex';
	userDateCreation.style.fontFamily = '"RobotoCondensed", sans-serif';
	userDateCreation.style.paddingBottom = '1rem';

	card.appendChild(userPic);
	card.appendChild(userName);
	card.appendChild(userDateCreation);
	infoCardsContainer.appendChild(card);
}


export function populateDashboard(msg: any)
{
	const matchHistoryList = document.getElementById('matchHistoryList');
	const infoCardsContainer = document.getElementById('infoCardsContainer');
	if (!infoCardsContainer || !matchHistoryList)
		return ;
	console.log(`populateDashboard`);
	console.log(`populateDashboard: ${msg}, ${msg.matches}, ${msg.player}, ${msg.stats}, ${msg.log_time}`);
	
	log(`populateDashboard`);
	log(`populateDashboard: ${msg}, ${msg.matches}, ${msg.player}, ${msg.stats}, ${msg.log_time}`);
	renderMatchInfo(msg.matches, matchHistoryList);
	renderUserInfoCard(msg.player, infoCardsContainer);
	renderUserStatsCard(msg.stats, infoCardsContainer);
	renderPlayingTimeCard(msg.log_time, infoCardsContainer);
}

export function getDashboard()
{
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	body.innerHTML = '';

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

	const matchHistoryRows = document.createElement('div');
	matchHistoryRows.id = 'matchHistoryRows';
	matchHistoryRows.style.background = '#363430';
	matchHistoryRows.style.display = 'flex';
	matchHistoryRows.style.flexDirection = 'column';
	matchHistoryRows.style.aspectRatio = '4 / 3';
	matchHistoryRows.style.width = 'clamp(500px, 80vw, 1200px)';
	matchHistoryRows.style.height = 'clamp(300px, 50vh, 800px)';
	matchHistoryRows.style.borderRadius = '16px';
	matchHistoryRows.style.position = 'relative';
	matchHistoryRows.style.boxSizing = 'border-box';
	matchHistoryRows.style.alignItems = 'flex-start';

	const matchHistoryTitle = document.createElement('div');
	matchHistoryTitle.id = 'matchHistoryTitle';
	matchHistoryTitle.textContent = 'Match History';
	matchHistoryTitle.style.fontFamily = '"Horizon", monospace';
	matchHistoryTitle.style.color = 'transparent';
	matchHistoryTitle.style.fontSize = 'clamp(18px, 3vw, 36px)';
	matchHistoryTitle.style.webkitTextStroke = '0.1rem #ffffff';
	matchHistoryTitle.style.whiteSpace = 'nowrap';
	matchHistoryTitle.style.display = 'inline-block';
	matchHistoryTitle.style.background = '#363430';;
	matchHistoryTitle.style.borderRadius = '16px';
	matchHistoryTitle.style.width = 'clamp(500px, 80vw, 1200px)';
	matchHistoryTitle.style.padding = '0.5rem';
	matchHistoryTitle.style.boxSizing = 'border-box';

	const matchHistoryHeaders = document.createElement('div');
	matchHistoryHeaders.id = 'matchHistoryHeaders';
	matchHistoryHeaders.style.display = 'flex';
	matchHistoryHeaders.style.width = "100%";
	matchHistoryHeaders.style.justifyContent = 'space-between';
	matchHistoryHeaders.style.alignContent = 'center';
	matchHistoryHeaders.style.alignItems = 'center';
	matchHistoryHeaders.style.fontSize = 'clamp(5px, 1.2vw, 15px)';
	matchHistoryHeaders.style.fontFamily = '"Horizon", monospace';
	matchHistoryHeaders.style.color = 'white';
	matchHistoryHeaders.style.padding = '0.7% 0';
	matchHistoryHeaders.style.whiteSpace = 'nowrap';

	const labels = ['Opponent', 'Date', 'Winner', 'Score', 'Duration', 'Total Hits'];
	labels.forEach(text => {
	const headerItem = document.createElement('div');
		headerItem.textContent = text;
		headerItem.style.flex = '1';
		matchHistoryHeaders.style.textAlign = 'center';
		matchHistoryHeaders.appendChild(headerItem);
	})

	const matchHistoryList = document.createElement('div');
	matchHistoryList.id = 'matchHistoryList';
	matchHistoryList.style.display = 'flex';
	matchHistoryList.style.flexDirection = 'column';
	matchHistoryList.style.width = '95%';
	matchHistoryList.style.gap = '1rem';
	matchHistoryList.style.overflowY = 'auto';
	matchHistoryList.style.flexGrow = '1';
	matchHistoryList.style.paddingLeft = '2%';
	matchHistoryList.style.fontFamily = '"RobotoCondensed", sans-serif';
	matchHistoryList.style.fontSize = 'min(2vw, 2vh)';
	matchHistoryList.style.textAlign = 'center';

	const infoCardsContainer = document.createElement('div');
	infoCardsContainer.id = 'infoCardsContainer';
	infoCardsContainer.style.display = 'flex';
	infoCardsContainer.style.direction = 'row';
	infoCardsContainer.style.width = 'clamp(500px, 80vw, 1200px)';
	infoCardsContainer.style.height = 'clamp(200px, 25vh, 300px)';
	infoCardsContainer.style.justifyContent = 'space-between';
	infoCardsContainer.style.background = 'transparent';
	infoCardsContainer.style.gap = '1rem';
	infoCardsContainer.style.aspectRatio = '3/4';

	const exitButton = document.createElement('button');
	exitButton.id = 'exitButton';
	exitButton.textContent = 'X';
	exitButton.style.color = 'black';
	exitButton.style.fontSize = 'clamp(10px, 1.5vw, 15px)';
	exitButton.style.position = 'fixed';
	exitButton.style.top = '1rem';
	exitButton.style.right = '1rem';
	exitButton.style.background = 'transparent';
	exitButton.style.border = 'transparent';
	exitButton.style.fontSize = 'clamp(10px, 2vw, 30px)';
	exitButton.style.fontFamily = '"Horizon", sans-serif';

	exitButton.addEventListener('click', () => {
		const matchHistoryRows = document.getElementById('matchHistoryRows');
		if (matchHistoryRows) {
			matchHistoryRows.remove();
		}
		navigateTo('Menu');
	});

	matchHistoryRows.appendChild(matchHistoryHeaders);
	matchHistoryRows.appendChild(matchHistoryList);
	containerDashboard.appendChild(infoCardsContainer);
	containerDashboard.appendChild(matchHistoryTitle);
	containerDashboard.appendChild(matchHistoryRows);
	body.append(containerDashboard);
	body.append(exitButton);
	Game.socket.emit('message', { action: 'dashboard', subaction: 'getFullDataDashboard' });
}
