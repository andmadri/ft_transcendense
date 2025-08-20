import { log } from '../logging.js'
import { Game } from "../gameData.js"
import { styleElement } from './menuContent.js'

function createOnlineList(): HTMLDivElement {
	const online = document.createElement('div');
	online.id = 'online';
		styleElement(online, {
		backgroundColor: 'white',
		padding: '20px',
		textAlign: 'left',
		flex: '1',
		borderRadius: '10px'
	});

	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Online';
	title.style.textAlign = 'center';

	const list = document.createElement('div');
	list.id = 'listOnlinePlayers';

	const html_list = document.createElement('ul');
	html_list.id = 'htmllistOnlinePlayers';
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	online.append(title, list);
	return (online);
}

export function getOnlineList(): HTMLDivElement {
	let online = document.getElementById('online') as HTMLDivElement;
	
	if (!online)
		online = createOnlineList();
	else {
		const list = document.getElementById('htmllistOnlinePlayers');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	// backend request to the DB for all online players
	// const online_players = ['Player1', 'Player2', 'Player3']; // This should be replaced with actual data from the backend
	Game.socket.send({
		action: 'online', 
		subaction: 'getOnlinePlayers'
	});
	return (online);
}

function insertOnlinePlayers(online_players: any) {
	const html_list = document.getElementById('htmllistOnlinePlayers') as HTMLUListElement;
	if (!html_list) {
		log("HTML list for online players not found");
		return;
	}
	html_list.className = 'playerOfOnlineList';

	// json online_players mapping to array with names
	const playerNames: string[] = online_players.map((player: { name: string, avatar_url: string }) => player.name);
	for (const curr_player of playerNames) {
		log(`Adding player ${curr_player} to online list`);
		const html_list_element = document.createElement('li');
		
		html_list_element.textContent = curr_player;
		html_list.appendChild(html_list_element);
	}
}

function processOnlinePlayers(data: any) {
	if (data.access && data.access == "yes")
		insertOnlinePlayers(data.content);
	else
		log("Access to DB: " + data.access + " " + data.content);
}

export function actionOnline(data: any) {
	if (!data.subaction) {
		log('no subaction online');
		return ;
	}
	
	switch(data.subaction) {
		case "retOnlinePlayers":
			processOnlinePlayers(data);
			break ;
		default:
			log(`(actionOnline) Unknown action: ${data.subaction}`);
	}
}