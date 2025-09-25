import { log } from '../logging.js'
import { Game, UI } from "../gameData.js"
import { styleRow, styleListBtns } from './menuContent.js'
import { navigateTo } from '../history.js';
import { customAlert } from '../Alerts/customAlert.js';


function createPlayerList(): HTMLDivElement {
	const playerList = document.createElement('div');
	playerList.id = 'players';

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

	if (!playerList) {

		console.log("createPlayerList getting called");
		playerList = createPlayerList();
	}
	else {
		console.log("createPlayerList emptied");
		const list = document.getElementById('htmllistPlayers') as HTMLUListElement;
		if (list)
			list.innerHTML = '';
	}
	console.log("getPlayerList send request to backend");
	Game.socket.emit('message', {
		action: 'players',
		subaction: 'getAllPlayers'
	});
	return (playerList);
}

export function insertPlayers(players: any) {
	const html_list = document.getElementById('players_list') as HTMLUListElement;
	if (!html_list) {
		console.error('HTML_NOT_FOUND', 'HTML List for Friends Not Found', 'insertPlayers');

		return;
	}
	html_list.innerHTML = "";
	html_list.className = 'playerOfList';
	for (const player of players) {
		//I don't want to show the current player
		if (player.id > 2 && player.id !== UI.user1.ID && !player.isFriend) {
			const row = styleRow(player.name);
			const status = player.online_status == 0 ? 'offline' : 'online';
			row.style.color = status === 'online' ? 'green' : 'gray';

			const btnContainer = document.createElement('div');
			btnContainer.style.display = 'flex';
			btnContainer.style.gap = '0.3rem';

			//what about player2
			// if (!player.isFriend) {
			const addFriendBtn = document.createElement('button');
			styleListBtns(addFriendBtn, 'url("../../images/add_friend.png")');
			addFriendBtn.addEventListener("click", () => {
				customAlert(`You send ${player.name} a friend request`); //needed customAlert
				const id = UI.user1.ID;
				const friendID = player.id;
				Game.socket.emit('message', { action: "friends", subaction: "friendRequest", id, friendID });
			});
			btnContainer.appendChild(addFriendBtn);
			// }

			const dashboardBtn = document.createElement('button');
			styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
			dashboardBtn.addEventListener("click", () => {
				navigateTo(`Dashboard?userId=${player.id}`);
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
		log('no subaction Players');
		return;
	}

	switch (data.subaction) {
		case "retPlayers":
			processPlayers(data);
			break;
		default:
			log(`(actionPlayers) Unknown action: ${data.subaction}`);
	}
}