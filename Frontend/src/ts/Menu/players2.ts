import { log } from '../logging.js'
import { Game, UI } from "../gameData.js"
import { styleRow, styleListBtns } from './menuContent.js'
import { navigateTo } from '../history.js';
import { getDashboard } from '../Dashboard/dashboardContents.js';



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
			if (player.id > 2 && player.id !== UI.user1.ID) {
			const row = styleRow(player.name);
			// const status = player.online_status == 0 ? 'offline' : 'online';
			// row.style.color = status === 'online' ? 'green' : 'gray';

			const btnContainer = document.createElement('div');
			btnContainer.style.display = 'flex';
			btnContainer.style.gap = '0.3rem';

			//what about player2
			if (!player.isFriend) {
				const addFriendBtn = document.createElement('button');
				styleListBtns(addFriendBtn, 'url("../../images/add_friend.png")');
				addFriendBtn.addEventListener("click", () => {
					alert(`Send ${player.name} a friend request`);
					const id = UI.user1.ID;
					const friendID = player.id;
					Game.socket.emit('message', {action: "friends", subaction: "friendRequest", id, friendID});
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