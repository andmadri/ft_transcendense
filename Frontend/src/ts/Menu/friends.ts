import { styleElementMenu } from "./menuContent.js";
import { Game } from '../script.js'

function createFriendsList() : HTMLDivElement {
	const friends = document.createElement('div');
	friends.id = 'friends';
	styleElementMenu(friends, {
		backgroundColor: 'white',
		border: '2px solid black',
		padding: '15px',
		textAlign: 'center',
		borderRadius: '10px',
		flex: '1'
	});
	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Friends';

	const list = document.createElement('div');
	list.id = 'listFriends';

	const html_list = document.createElement('ul');
	html_list.id = 'htmllistFriends';
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	friends.append(title, list);	
	return (friends);	
}

export function getFriendsList(): HTMLDivElement {
	let friends = document.getElementById('friends') as HTMLDivElement;

	if (!friends)
		friends = createFriendsList();
	else {
		const list = document.getElementById('htmllistFriends');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	const msg = {action: 'friends', subaction: 'getFriends', player: Game.id};
	Game.socket.send(JSON.stringify(msg));
	return (friends);
}