import { styleElement } from './menuContent.js';
import { Game, UI } from '../gameData.js'
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

	Game.socket.emit('message',{ 
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
	html_list.innerHTML = "";
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
	    html_list_element.style.display = 'flex';
	    html_list_element.style.justifyContent = 'space-between';
	    html_list_element.style.alignItems = 'center';

	    const status = friend.online_status == 0 ? '(offline)' : '(online)';
	    html_list_element.textContent = `${friend.name} ${status}`;

	    const deleteFriendBtn = document.createElement('button');
	    deleteFriendBtn.textContent = "Unfriend";

	    deleteFriendBtn.addEventListener("click", () => {
	        Game.socket.emit('message',{
	            action: 'friends',
	            subaction: 'unfriend',
	            userID: UI.user1.ID,
	            friendID: friend.id
	        });
	        console.log("Unfriend player: " + friend.name);
	        html_list_element.remove();
	    });
	    html_list_element.appendChild(deleteFriendBtn);
	    html_list.appendChild(html_list_element);
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
		log('no subaction Friends');
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
			alert(data.content);
			break ;
		default:
			log(`(actionFriends) Unknown action: ${data.subaction}`);
	}
}