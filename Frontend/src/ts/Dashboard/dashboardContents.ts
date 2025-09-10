import { Game, UI } from '../gameData'
import * as S from '../structs.js'
import { renderPlayingTimeCard } from './playingTime'
import { renderUserStatsCard } from './userStats'
import { log } from '../logging.js'
import { navigateTo } from '../history'
import { createBackgroundText } from '../Menu/menuContent'

function renderMatchInfo(matches: any, matchList: HTMLElement)
{
	for (let match of matches) {
		const row = document.createElement('div');
		row.style.display = 'flex';
		row.style.position = 'relative';
		row.style.width = '100%';
		row.style.height = '5%';
		row.style.background = 'rgba(0, 0, 0, 0.18)';
		row.style.cursor = 'pointer';
		row.style.borderRadius = '5px';
		row.style.boxShadow = '2.6px 5.1px 5.1px hsl(0deg 0% 0% / 0.42)';
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

		const matchId = Number(match.match_id);
		row.addEventListener('click', () => {
			if (Number.isFinite(matchId)) {
				navigateTo(`GameStats?matchId=${matchId}`);
			} else {
				console.warn('No match_id on row:', match);
			}
		});
		matchList.appendChild(row);
	}
}

function renderUserInfoCard(user_info: any, infoCardsContainer: HTMLElement)
{
	const card = document.createElement('div');
	card.id = 'userInfoCard';
	// card.style.aspectRatio = '4 / 3';
	card.style.borderRadius = '10px';
	card.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
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
	const matchList = document.getElementById('matchList');
	const infoCardsContainer = document.getElementById('infoCardsContainer');
	if (!infoCardsContainer || !matchList)
		return ;
	renderMatchInfo(msg.matches, matchList);
	renderUserInfoCard(msg.player, infoCardsContainer);
	renderUserStatsCard(msg.stats, infoCardsContainer);
	renderPlayingTimeCard(msg.log_time, infoCardsContainer);
}

export function getDashboard(playerID?: number, playerNr?: number)
{
	if (UI.state !== S.stateUI.Dashboard) 
		return;
	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	body.innerHTML = '';

	createBackgroundText(body);

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
	// dashboard.style.width = '80vw';
	// dashboard.style.height = '50vh';
	dashboard.style.width = 'clamp(500px, 80vw, 1200px)';
	dashboard.style.height = 'clamp(300px, 50vh, 800px)';
	dashboard.style.borderRadius = '10px';
	dashboard.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	dashboard.style.position = 'relative';
	dashboard.style.boxSizing = 'border-box';
	dashboard.style.alignItems = 'flex-start';

	const title = document.createElement('div');
	title.id = 'dashboardTitle';
	title.textContent = 'Match History';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	// title.style.fontSize = 'min(3vw, 3vh)';
	title.style.fontSize = 'clamp(18px, 3vw, 36px)';
	title.style.webkitTextStroke = '0.1rem #ffffff';
	title.style.whiteSpace = 'nowrap';
	title.style.display = 'inline-block';
	title.style.background = '#363430';;
	title.style.borderRadius = '10px';
	title.style.boxShadow = '4.8px 9.6px 9.6px hsl(0deg 0% 0% / 0.35)';
	// title.style.width = '80vw';
	title.style.width = 'clamp(500px, 80vw, 1200px)';
	title.style.padding = '0.5rem';
	title.style.boxSizing = 'border-box';

	const headers = document.createElement('div');
	headers.id = 'dashboardHeaders';
	headers.style.display = 'flex';
	headers.style.width = "100%";
	headers.style.justifyContent = 'space-between';
	headers.style.alignContent = 'center';
	headers.style.alignItems = 'center';
	//clamped
	headers.style.fontSize = 'clamp(5px, 1.2vw, 15px)';
	headers.style.fontFamily = '"Horizon", monospace';
	headers.style.color = 'white';
	headers.style.padding = '0.7% 0';
	headers.style.whiteSpace = 'nowrap';

	const labels = ['Opponent', 'Date', 'Winner', 'Score', 'Duration', 'Total Hits'];
	labels.forEach(text => {
	const headerItem = document.createElement('div');
		headerItem.textContent = text;
		headerItem.style.flex = '1';
		headers.style.textAlign = 'center';
		headers.appendChild(headerItem);
	})

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
		const dashboard = document.getElementById('dashboard');
		if (dashboard) {
			dashboard.remove();
		}
		navigateTo('Menu');
	});

	dashboard.appendChild(headers);
	dashboard.appendChild(matchList);
	containerDashboard.appendChild(infoCardsContainer);
	containerDashboard.appendChild(title);
	containerDashboard.appendChild(dashboard);
	body.append(containerDashboard);
	body.append(exitButton);
	const msg = {action: 'dashboard', subaction: 'getFullDataDashboard', playerID: playerID, playerNr: playerNr};
	console.log(`Sending msg to the backend: ${msg.action} ${msg.subaction}`);
	Game.socket.emit('message', { action: 'dashboard', subaction: 'getFullDataDashboard' });
}
