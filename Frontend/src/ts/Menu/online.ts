import { log } from '../logging.js'

function insertOnlinePlayers(online_players: any) {
	const html_list = document.getElementById('htmllistOnlinePlayers') as HTMLUListElement;
	if (!html_list) {
		log("HTML list for online players not found");
		return;
	}
	// json online_players mapping to array with names
	const playerNames: string[] = online_players.map((player: { name: string, avatar_url: string }) => player.name);
	for (const curr_player of playerNames) {
		log(`Adding player ${curr_player} to online list`);
		const html_list_element = document.createElement('li');
		html_list.id = 'playerOfOnlineList';
		html_list_element.textContent = curr_player;
		html_list.appendChild(html_list_element);
	}
}

function processOnlinePlayers(data: any) {
	if (data.access && data.access == "yes")
		insertOnlinePlayers(data.content);
	else
		log("Access to DB: " + data.access);
}

export function actionOnline(data: any) {
	if (!data.subaction) {
		log('no subaction');
		return ;
	}
	
	switch(data.subaction) {
		case "retOnlinePlayers":
			processOnlinePlayers(data);
		default:
			log(`(actionOnline) Unknown action: ${data.subaction}`);
	}
}