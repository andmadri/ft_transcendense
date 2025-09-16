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
		console.log('HTML List for Friends Not Found');
		return;
	}
	html_list.innerHTML = "";
	const friendsArray = Array.isArray(friends.content) ? friends.content : [];
	//there is a problem with the friends data
	for (const friend of friendsArray)
	{
			const row = styleRow(friend.name);
			const status = friend.online_status == 0 ? 'offline' : 'online';
			row.style.color = status === 'online' ? 'green' : 'gray';

			const btnContainer = document.createElement('div');
			btnContainer.style.display = 'flex';
			btnContainer.style.gap = '0.3rem';

			const challengeFriendBtn = document.createElement('button');
			styleListBtns(challengeFriendBtn, 'url("../../images/delete_friend.png")');
			challengeFriendBtn.addEventListener("click", () => {
				UI.state = S.stateUI.Game;
				Game.match.state = state.Pending;
				Game.pendingState = S.pendingState.Friend;
				Game.socket.emit('message', {
					action: 'matchmaking',
					subaction: 'challengeFriend',
					challenger: UI.user1.ID,
					responder: friend.id
				})
			});
		
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
				// console.log('dashboard call friend.id', friend.id);
				navigateTo(`Dashboard?userId=${friend.id}`);
			});
			btnContainer.appendChild(challengeFriendBtn);
			btnContainer.appendChild(deleteFriendBtn);
			btnContainer.appendChild(dashboardBtn);
			row.appendChild(btnContainer);
			html_list.appendChild(row);
	}
}

// function processFriends(data: any) {
// 	if (data.access && data.access == "yes")
// 		insertFriends(data.content);
// 	else
// 		console.log("User has no Friends to Display");
// }

export function actionFriends(data: any) {
	if (!data.subaction) {
		log('no subaction Friends');
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
			alert(data.content);
			break ;
		default:
			console.log(`(actionOnline) Unknown action: ${data.subaction}`);
	}
}