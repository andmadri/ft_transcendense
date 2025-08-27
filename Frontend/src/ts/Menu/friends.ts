import { styleElement } from './menuContent.js';
import { Game } from '../gameData.js'
import { log } from '../logging.js';
import { showFriendRequests } from './friendRequests.js';

function createFriendsList(playerNr: number) : HTMLDivElement {
	const friends = document.createElement('div');
	friends.id = 'friends' + playerNr;
	styleElement(friends, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		textAlign: 'center',
		borderRadius: '10px',
		flex: '1'
	});
	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Friends';

	const list = document.createElement('div');
	list.id = 'listFriends' + playerNr;

	const html_list = document.createElement('ul');
	html_list.id = 'htmllistFriends' + playerNr;
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	friends.append(title, list);
	return (friends);
}

export function getFriendsList(playerNr: number): HTMLDivElement {
	let friends = document.getElementById('friends') as HTMLDivElement;

	if (!friends)
		friends = createFriendsList(playerNr);
	else {
		const list = document.getElementById('htmllistFriends');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	Game.socket.send({ 
		action: 'friends', 
		subaction: 'getFriends', 
		playerNr });
	return (friends);
}


function insertFriends(friends: any, playerNr: number, noFriends: boolean) {
	const html_list = document.getElementById('htmllistFriends' + playerNr) as HTMLUListElement;
	if (!html_list) {
		log('HTML list for friends not found');
		return;
	}
	html_list.className = 'friendsList';

	if (noFriends) {
		const html_list_element = document.createElement('li');
		html_list_element.textContent = 'No friends';
		html_list_element.style.textAlign = 'left';
		html_list.appendChild(html_list_element);
		return ;
	}
	for (const friend of friends) {
		log(`Adding player ${friend.name} to Friends list`);
		const html_list_element = document.createElement('li');
		const status = friend.online_status == 0 ? '(offline)' : '(online)';
		const deleteFriendBtn = document.createElement('button');
		deleteFriendBtn.textContent = "Unfriend";
		deleteFriendBtn.addEventListener("click", () => {
			Game.socket.send({
				action: 'friends',
				subaction: 'unfriend',
				userID: Game.match.player1.id,
				friendID: friend.id
			})
			console.log("Unfriend player: " + friend.name);
		});
		html_list_element.textContent = `${friend.name} ${status}`;
		html_list.append(html_list_element, deleteFriendBtn);
	}
}

function processFriends(data: any) {
	const playerNr = data.playerNr;
	if (data.access && data.access == 'yes')
		insertFriends(data.content, playerNr, false);
	else {
		log('Access to DB: ' + data.access + ' ' + data.content);
		insertFriends(data, playerNr, true);
	}
}


export function actionFriends(data: any) {
	if (!data.subaction) {
		log('no subaction online');
		return ;
	}

	switch(data.subaction) {
		case 'retFriends':
			processFriends(data);
			break ;
		case 'openRequests':
			showFriendRequests(data.content);
			break ;
		case 'error':
			alert(data.msg);
			break ;
		default:
			log(`(actionOnline) Unknown action: ${data.subaction}`);
	}
}