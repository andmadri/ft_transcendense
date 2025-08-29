import { log } from '../logging.js'
import { Game, UI } from "../gameData.js"
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
	title.textContent = 'Players';
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
	Game.socket.send({
		action: 'online', 
		// subaction: 'getOnlinePlayers'
		subaction: 'getAllPlayers'
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
	console.log(online_players); 
	for (const curr_player of online_players) {
		if (curr_player.id > 2) {
			console.log(curr_player); 
			const html_list_element = document.createElement('li');
			
			html_list_element.textContent = curr_player.name;
			html_list_element.dataset.userId = String(curr_player.id);
			html_list_element.style.cursor = "pointer";
			html_list_element.style.color = 'black';

			if (curr_player.name != UI.user1.name && !curr_player.isFriend) {
				const addFriendBtn = document.createElement('button');
				addFriendBtn.textContent = 'Add friend';

				addFriendBtn.addEventListener("click", () => {
					alert(`Send ${curr_player.name} a friend request`);
					const id = UI.user1.ID;
					const friendID = curr_player.id;
					Game.socket.send({action: "friends", subaction: 'friendRequest', id, friendID});
				});
				html_list.append(html_list_element, addFriendBtn);
			} else
				html_list.append(html_list_element);
			
		}
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