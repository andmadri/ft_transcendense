import { actionGame } from './Game/game.js'
import { actionOnline } from './Menu/online.js'
import { log } from './logging.js' 
import { Game } from './script.js'
import { getPlayerData, actionPlayerInfo } from './SideMenu/updatePlayerData.js'
import { actionFriends } from './Menu/friends.js'
import { actionMatchmaking } from './Matchmaking/challengeFriend.js'
import { populateDashboard } from './Dashboard/dashboardContents.js'

export function startSocketListeners() {
	const socket = Game.socket;

	socket.on('connect', () => {
		console.log('Connected with id:', socket.id);
		getPlayerData();
	});

	socket.on('message', (msg: any)=> {
		receiveFromWS(msg)
	}); 

	socket.on('disconnect', (reason: any) => {
		log('Disconnected: '+ reason);
	});

	socket.on('connect_error', (err: any) => {
		log('Error: ' + err);
	});

	socket.on('error', (err: any) => {
		log('Error: ' + err.reason);
	});
}

// ADDED FOR CREATING IMAGE IN THE BACKEND - this function
function ensureStatsChartElement(): HTMLImageElement {
  let img = document.getElementById('statsChart') as HTMLImageElement | null;
  if (!img) {
    const container = document.getElementById('statsChartContainer') ?? document.body;
    img = document.createElement('img');
    img.id = 'statsChart';
    img.alt = 'User state durations';
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    container.appendChild(img);
  }
  return img;
}

/*
FROM backend TO frontend
• playerInfo => getName / getAvatar / revicePlayerData
• chat => incomming
• friends => retFriends
• online => retOnlinePlayers / retOnlinePlayersWaiting
• friends => retFriends
• matchMaking => getWaitlist / createGame / startGame
• game => ballUpdate / padelUpdate / scoreUpdate
• error => checkError / errorPage?
*/
export function receiveFromWS(msg: any) {
	let data;
	try {
        data = JSON.parse(msg);
    } catch (e) {
        data = msg;
    }
	console.log('Got message from backend:', data);
	const action = data.action;
	if (!action)
		log('no action');

	switch(action) {
		case 'playerInfo':
			actionPlayerInfo(data);
			break ;
		case 'online':
			actionOnline(data);
			break ;
		case 'friends':
			actionFriends(data);
			break ;
		case 'matchmaking':
			actionMatchmaking(msg);
			break ;
		case 'game':
			// ADDED FOR CREATING IMAGE IN THE BACKEND - this if statement
			if (data.subaction === 'save' && data.chartUrl) {
				console.log("Has data.chartUrl:", data.chartUrl);
				const img = ensureStatsChartElement();
				img.onload = () => console.log('Chart loaded:', img.naturalWidth, img.naturalHeight);
				img.onerror = (e) => console.error('Chart failed to load', e);
				img.src = data.chartUrl + '?t=' + Date.now(); // avoid stale cache
			}
			actionGame(data);
			break;
		case 'dashboardInfo':
			populateDashboard(data);
			break;
		case 'error':
			if (data.reason)
				log('error' + `${data.reason}`);
			else
				log('data received from ws' + data);
			break ;
		default:
			log(`(receiveFromWS) Unknown action: ${action}`);
	}
}