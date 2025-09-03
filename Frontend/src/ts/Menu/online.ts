import { log } from '../logging.js'
import { Game } from "../gameData.js"
import { styleRow, styleListBtns } from './menuContent.js'
import { navigateTo } from '../history.js';
import { getDashboard } from '../Dashboard/dashboardContents.js';

// function createOnlineList(): HTMLDivElement {
// 	const online = document.createElement('div');

// 	const title = document.createElement('h2');
// 	title.className = 'sectionTitle';
// 	title.textContent = 'Players';
// 	title.style.textAlign = 'center';

// 	const list = document.createElement('div');
// 	list.id = 'listOnlinePlayers';

// 	const html_list = document.createElement('ul');
// 	html_list.id = 'htmllistOnlinePlayers';
// 	html_list.className = 'online-markers';

// 	list.appendChild(html_list);
// 	online.append(title, list);
// 	return (online);
// }

// export function getOnlineList(): HTMLDivElement {
// 	let online = document.getElementById('online') as HTMLDivElement;
	
// 	if (!online)
// 		online = createOnlineList();
// 	else {
// 		const list = document.getElementById('htmllistOnlinePlayers');
// 		if (list instanceof HTMLUListElement)
// 			list.innerHTML = '';
// 	}
// 	Game.socket.send({
// 		action: 'online', 
// 		// subaction: 'getOnlinePlayers'
// 		subaction: 'getAllPlayers'
// 	});
// 	return (online);
// }

// function insertOnlinePlayers(online_players: any) {
// 	const html_list = document.getElementById('htmllistOnlinePlayers') as HTMLUListElement;
// 	if (!html_list) {
// 		log("HTML list for online players not found");
// 		return;
// 	}
// 	html_list.className = 'playerOfOnlineList';
// 	console.log(online_players); 
// 	// for (const curr_player of online_players) {
// 	// 	if (curr_player.id > 2) {
// 			// console.log(curr_player); 
// 			// const html_list_element = document.createElement('li');
			
// 			// html_list_element.textContent = curr_player.name;
// 			html_list_element.dataset.userId = String(curr_player.id);
// 			html_list_element.style.cursor = "pointer";
// 			html_list_element.style.color = 'black';

// 			if (curr_player.name != Game.match.player1.name && !curr_player.isFriend) {
// 				const addFriendBtn = document.createElement('button');
// 				addFriendBtn.textContent = 'Add friend';

// 				addFriendBtn.addEventListener("click", () => {
// 					alert(`Send ${curr_player.name} a friend request`);
// 					const id = Game.match.player1.id;
// 					const friendID = curr_player.id;
// 					Game.socket.send({action: "friends", subaction: 'friendRequest', id, friendID});
// 				});
// 				html_list.append(html_list_element, addFriendBtn);
// 			} else
// 				html_list.append(html_list_element);
			
// 		}
// 	}
// }

export function insertPlayers(online_players: any) {
	const html_list = document.getElementById('players_list') as HTMLUListElement;
		if (!html_list) {
		console.log('HTML List for Friends Not Found');
		return;
	}
	html_list.innerHTML = "";
	for (const player of online_players)
	{
		//I don't want to show the current player
			if (player.id > 2) {
			const row = styleRow(player.name);
			// const status = player.online_status == 0 ? 'offline' : 'online';
			// row.style.color = status === 'online' ? 'green' : 'gray';

			const btnContainer = document.createElement('div');
			btnContainer.style.display = 'flex';
			btnContainer.style.gap = '0.3rem';

			//what about player2
			if (player.name != Game.match.player1.name && !player.isFriend) {
				const addFriendBtn = document.createElement('button');
				styleListBtns(addFriendBtn, 'url("../../images/add_friend.png")');
				addFriendBtn.addEventListener("click", () => {
					alert(`Send ${player.name} a friend request`);
					const id = Game.match.player1.id;
					const friendID = player.id;
					Game.socket.send({action: "friends", subaction: "friendRequest", id, friendID});
				});
				btnContainer.appendChild(addFriendBtn);
			}

			const dashboardBtn = document.createElement('button');
			styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
			dashboardBtn.addEventListener("click", () => {
				navigateTo('Dashboard');
				getDashboard(player.id, undefined);
			});
			btnContainer.appendChild(dashboardBtn);
			row.appendChild(btnContainer);
			html_list.append(row);
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
		log('no subaction online');
		return ;
	}
	
	switch(data.subaction) {
		case "retOnlinePlayers":
			processPlayers(data);
			break ;
		default:
			log(`(actionOnline) Unknown action: ${data.subaction}`);
	}
}