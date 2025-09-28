import { Game, UI } from '../gameData.js'
import { log } from '../logging.js';
import { showFriendAndChallengeRequests } from './friendRequests.js';
import { styleRow, styleListBtns } from './menuContent.js'
import { navigateTo } from '../history.js';
import { state } from '@shared/enums'
import * as S from '../structs.js' 

function insertFriends(friends: any) {
	const html_list = document.getElementById('friends_list') as HTMLUListElement;
	if (!html_list) {
		console.error('HTML_NOT_FOUND', 'HTML List for Friends Not Found', 'insertFriends');
		return;
	}
	html_list.innerHTML = "";
	const friendsArray = Array.isArray(friends.content) ? friends.content : [];
	for (const friend of friendsArray)
	{
			const row = styleRow(friend.name);
			const status = friend.online_status == 0 ? 'offline' : 'online';
			row.style.color = status === 'online' ? 'green' : 'gray';

			const btnContainer = document.createElement('div');
			btnContainer.style.display = 'flex';
			btnContainer.style.gap = '0.3rem';

			if (status === 'online') {
				const challengeFriendBtn = document.createElement('button');
				styleListBtns(challengeFriendBtn, 'url("../../images/battle_friend.png")');
				challengeFriendBtn.addEventListener("click", () => {
					navigateTo('Pending');
					Game.pendingState = S.pendingState.Friend;
					Game.socket.emit('message', {
						action: 'matchmaking',
						subaction: 'challengeFriend',
						challenger: UI.user1.ID,
						responder: friend.id
					})
				});
				btnContainer.appendChild(challengeFriendBtn);
			}
		
			const deleteFriendBtn = document.createElement('button');
			styleListBtns(deleteFriendBtn, 'url("../../images/delete_friend.png")');
			deleteFriendBtn.addEventListener("click", () => {
				Game.socket.emit('message', {
					action: 'friends',
					subaction: 'unfriend',
					userID: UI.user1.ID,
					friendID: friend.id
				})
				console.log("Unfriend player: " + friend.name);
				row.remove();
			});

			const dashboardBtn = document.createElement('button');
			styleListBtns(dashboardBtn, 'url("../../images/dashboard.png")');
			dashboardBtn.addEventListener("click", () => {
				navigateTo(`Dashboard?userId=${friend.id}`);
			});
			btnContainer.appendChild(deleteFriendBtn);
			btnContainer.appendChild(dashboardBtn);
			row.appendChild(btnContainer);
			html_list.appendChild(row);
	}
}

export function actionFriends(data: any) {
	if (!data.subaction) {
		console.error('MSG_MISSING_SUBACTION', 'Invalid message format', 'missing subaction', data, 'actionFriends');
		return ;
	}
	switch(data.subaction) {
		case 'retFriends':
			insertFriends(data);
			break ;
		case 'openRequests':
			showFriendAndChallengeRequests(data.friendRequests, data.invites);
			break ;
		case 'error':
			console.error('ERROR_FRIEND', data.content);
			break ;
		default:
			console.error('MSG_UNKNOWN_SUBACTION', 'Invalid message format', 'Unknown:', data.subaction, 'actionFriends');
	}
}