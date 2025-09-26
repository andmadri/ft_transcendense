import { actionGame } from './Game/game.js'
import { actionPlayers } from './Menu/players.js'
import { Game, UI } from "./gameData.js"
import { actionPlayerInfo } from './updateInfo/updatePlayerData.js'
import { actionFriends } from './Menu/friends.js'
import { actionMatchmaking } from './Matchmaking/challengeFriend.js'
import { populateDashboard } from './Dashboard/dashboardContents.js'
import { actionInitOnlineGame } from './Game/initGame.js'
import { actionTournament } from './Tournament/tournamentContent.js'
import { actionUserDataMenu } from './Menu/userDataMenu.js'
import { getGameStats } from './Game/gameStats.js'
import { validateURL } from './Dashboard/exists.js'
import { customAlert } from './Alerts/customAlert.js';
import * as S from './structs.js'

export function startSocketListeners() {
	const socket = Game.socket;

	socket.on('connect', () => {
		console.log('Connected with id:', socket.id);
		if (document.getElementById('loadingpage'))
			document.body.removeChild(document.getElementById('loadingpage')!);
	});

	socket.on('message', (msg: any)=> {
		receiveFromWS(msg)
	});

	socket.on('disconnect', (reason: any) => {
		console.log('Disconnected: '+ reason);
	});

	socket.on('connect_error', (err: any) => {
		console.error(err.message || err);
	});

	// Only for errors from libaries / backend
	socket.on('error', (err: any) => {
		console.error('Error: ' + err.reason);
	});

	// custom errors (for our error handling)
	socket.on('server_error', (err: any) => {
		console.error(err.code, ' ', err.reason);
		if (err.code != "AUTH_NO_TOKEN")
			customAlert("Something went wrong. Please try again.");
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
		return console.error('MSG_MISSING_ACTION', 'Invalid message format:', 'action missing', 'receiveFromWS');

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
		case 'tournament':
			actionTournament(data);
			break ;
		case 'initOnlineGame':
			actionInitOnlineGame(data);
			break ;
		case 'gameStats':
			getGameStats(data);
			break ;
		case 'game':
			actionGame(data);
			break;
		case 'dashboardInfo':
			populateDashboard(data);
			break;
		case 'validate':
			validateURL(data);
			break;
		case 'error':
			if (data.reason)
				console.error('GEN_ERROR', data.reason, 'receiveFromWS');
			else
				console.error('GEN_ERROR', 'Unknown error', 'receiveFromWS');
			break ;
		default:
			console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format:', action, 'receiveFromWS');
	}
}