import { actionGame } from './Game/game.js'
import { actionPlayers } from './Menu/players.js'
import { log } from './logging.js' 
import { Game } from "./gameData.js"
import { getPlayerData, actionPlayerInfo } from './SideMenu/updatePlayerData.js'
import { actionFriends } from './Menu/friends.js'
import { actionMatchmaking } from './Matchmaking/challengeFriend.js'
import { populateDashboard } from './Dashboard/dashboardContents.js'
import { actionInitOnlineGame } from './Game/initGame.js'
import { actionUserDataMenu } from './Menu/userDataMenu.js'
import { insertSVGsGameStats } from './Game/gameStats.js'

export function startSocketListeners() {
	const socket = Game.socket;

	socket.on('connect', () => {
		console.log('Connected with id:', socket.id);
		if (document.getElementById('loadingpage'))
			document.body.removeChild(document.getElementById('loadingpage')!);
		getPlayerData();
	});

	socket.on('message', (msg: any)=> {
		receiveFromWS(msg)
	});

	socket.on('disconnect', (reason: any) => {
		log('Disconnected: '+ reason);
	});

	socket.on('connect_error', (err: any) => {
		log('Connection error: ' + err);
	});

	socket.on('error', (err: any) => {
		log('Error: ' + err.reason);
	});
}

/*
FROM backend TO frontend
• playerInfo => getName / getAvatar / revicePlayerData
• chat => incomming
• friends => retFriends
• players => retPlayers / retPlayersWaiting
• friends => retFriends
• matchMaking => getWaitlist / createGame / startGame
• game => ballUpdate / padelUpdate / scoreUpdate
• error => checkError / errorPage?
*/
export function receiveFromWS(data: any) {
	const action = data.action;
	if (!action)
		log('no action');

	// log(`receiveFromWS - action: ${action} - subaction: ${data.subaction}`);
	//when is this called: playerInfo?
	switch(action) {
		case 'playerInfo':
			actionPlayerInfo(data);
			break ;
		case 'players':
			actionPlayers(data);
			break;
		case 'userDataMenu':
			actionUserDataMenu(data);
			break ;
		case 'friends':
			actionFriends(data);
			break ;
		case 'matchmaking':
			actionMatchmaking(data);
			break ;
		case 'initOnlineGame':
			actionInitOnlineGame(data);
			break ;
		case 'gameStats':
			insertSVGsGameStats(data);
			break ;
		case 'game':
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