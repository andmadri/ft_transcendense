import { log } from '../logging.js'
import { Game, UI } from "../gameData.js"
import { styleElement } from './menuContent.js'

function createPlayerList(): HTMLDivElement {
	const playerList = document.createElement('div');
	playerList.id = 'players';
		styleElement(playerList, {
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
	list.id = 'listPlayers';

	const html_list = document.createElement('ul');
	html_list.id = 'htmllistPlayers';
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	playerList.append(title, list);
	return (playerList);
}

export function getPlayerList(): HTMLDivElement {
	let playerList = document.getElementById('players') as HTMLDivElement;
	
	if (!playerList)
		playerList = createPlayerList();
	else {
		const list = document.getElementById('htmllistPlayers');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}
	Game.socket.emit('message',{
		action: 'players', 
		subaction: 'getAllPlayers'
	});
	return (playerList);
}

function insertPlayers(players: any) {
	const html_list = document.getElementById('htmllistPlayers') as HTMLUListElement;
	if (!html_list) {
		log("HTML list for online players not found");
		return;
	}
	html_list.className = 'playerOfList';
	console.log("players:", players); 
	for (const curr_player of players) {
		if (curr_player.id > 2) {
			console.log(curr_player); 
			const html_list_element = document.createElement('li');
			const online = curr_player?.online_status == 0 ? '(offline)' : '(online)';
			html_list_element.textContent = curr_player.name + " " + online;
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
					Game.socket.emit('message',{action: "friends", subaction: 'friendRequest', id, friendID});
				});
				html_list.append(html_list_element, addFriendBtn);
			} else
				html_list.append(html_list_element);
			
		}
	}
}

function processPlayers(data: any) {
	if (data.access && data.access == "yes")
		insertPlayers(data.content);
	else
		log("Access to DB: " + data.access + " " + data.content);
}

export function actionPlayers(data: any) {
	if (!data.subaction) {
		log('no subaction Players');
		return ;
	}
	
	switch(data.subaction) {
		case "retPlayers":
			processPlayers(data);
			break ;
		default:
			log(`(actionPlayers) Unknown action: ${data.subaction}`);
	}
}