import { Game } from "../gameData.js";
// import { getFriendsList } from "./friends.js";

let friendRequestsDiv: HTMLDivElement | null = null;

export function initFriendRequestsContainer() {
	if (friendRequestsDiv)
		return;

	friendRequestsDiv = document.createElement('div');
	friendRequestsDiv.style.position = 'fixed';
	friendRequestsDiv.style.top = '1rem';
	friendRequestsDiv.style.right = '1rem';
	friendRequestsDiv.style.width = '300px';
	friendRequestsDiv.style.zIndex = '1000';
	friendRequestsDiv.style.display = 'flex';
	friendRequestsDiv.style.flexDirection = 'column';
	friendRequestsDiv.style.gap = '0.5rem';
	friendRequestsDiv.style.fontSize = '1rem';
	friendRequestsDiv.style.backgroundColor = 'white';
	friendRequestsDiv.style.border = '2px solid black'
	friendRequestsDiv.style.borderRadius = '5px'

	const body = document.getElementById('body');
	if (!body)
		return;
	body.appendChild(friendRequestsDiv);
}

function updateNotificationBadge(count: number, removed: boolean) {
	const badge = document.getElementById('notificationBadge');
	if (!badge)
		return;
	if (!removed) {
		if (count > 0) {
			badge.style.display = 'flex';
			badge.textContent = count >  99 ? '99+' : count.toString();
		} else {
			badge.style.display = 'none';
		}
	} else {
		const notificationBtn = document.getElementById('notificationBtn');
		if (!notificationBtn || badge.style.display == 'none')
			return ;
		if (badge.textContent == '+99')
			badge.textContent = '98';
		else {
			const amount = Number(badge.textContent);
			if (amount == 1)
				badge.style.display = 'none';
			else
				updateNotificationBadge(amount - 1, false);
		}
	}
}

export function showFriendRequests(requests: any) {
	const notificationBtn = document.getElementById('notificationBtn');
	const notificationBtnList = document.getElementById('notificationBtnList');
	if (!notificationBtnList)
		return ;
	notificationBtnList.innerHTML = '';
	notificationBtnList.style.gap = '0.5rem';
	notificationBtnList.style.overflowY = 'auto';

	updateNotificationBadge(requests.length, false);

	for (const req of requests) {

		const row = document.createElement('li');
		row.id = `row${req.ID}`;
		row.style.fontFamily = '"RobotoCondensed", sans-serif';
		row.style.background = 'transparent';
		row.style.padding = '12px 16px';
		row.style.borderRadius = '0';
		row.style.color = 'white';
		// row.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
		row.style.display = 'flex';
		row.style.justifyContent = 'space-between';
		row.style.alignItems = 'center';
		row.style.cursor = 'default';
		row.style.fontSize = '20px';
		row.dataset.requestId = req.id.toString();

		// row.addEventListener('mouseenter', () => {
		// 	row.style.backgroundColor = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
		// 	row.style.color = 'black';
		// 	row.style.borderRadius = '5px';
		// });
		// row.addEventListener('mouseleave', () => {
		// 	row.style.backgroundColor = 'transparent';
		// 	// row.style.backgroundColor = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
		// 	row.style.color = 'black';
		// 	row.style.borderRadius = '5px';
		// });

		const nameSpan = document.createElement('span');
		nameSpan.style.display = 'flex';
		nameSpan.style.flex = '1';
		nameSpan.textContent = req.requester_name;
		row.appendChild(nameSpan);

		const buttonContainer = document.createElement('div');
		buttonContainer.style.justifyContent = 'space-between';
		buttonContainer.style.display = 'flex';
		buttonContainer.style.flex = '1';
		buttonContainer.style.padding = '0.3rem';

		const acceptBtn = document.createElement('button');
		acceptBtn.style.borderRadius = '50%';
		acceptBtn.textContent = '✓';
		acceptBtn.style.fontFamily = '"Horizon", sans-serif';
		acceptBtn.style.background = '#ffc233'
		acceptBtn.style.border = 'none';
		acceptBtn.onclick = () => {
			handleFriendRequest(req.id, 'accept')
			document.getElementById(`row${req.ID}`)?.remove();
			updateNotificationBadge(0, true);
		};

		const denyBtn = document.createElement('button');
		denyBtn.textContent = '✗';
		denyBtn.style.borderRadius = '50%';
		denyBtn.style.borderRadius = '"Horizon", sans-serif';
		denyBtn.style.background = '#ffc233'
		denyBtn.style.border = 'none';
		denyBtn.onclick = () => {
			handleFriendRequest(req.id, 'deny');
			document.getElementById(`row${req.ID}`)?.remove();
			updateNotificationBadge(0, true);
		}
		buttonContainer.append(acceptBtn, denyBtn);
		row.appendChild(buttonContainer);
		notificationBtnList.appendChild(row);
	}
}

function handleFriendRequest(requestId: number, acceptOrDeny: string) {
	console.log(`Friend request ${requestId} ${acceptOrDeny}`);
	Game.socket.emit('message',{
		action: 'friends',
		subaction: acceptOrDeny + 'FriendRequest',
		requestId,
		playerNr: 1	
	})
	if (!friendRequestsDiv)
		return;

	const requestDiv = friendRequestsDiv.querySelector<HTMLDivElement>(
		`div[data-request-id='${requestId}']`);
	requestDiv?.remove();

	const remaining = document.querySelectorAll('div.friend-request-item');
	if (remaining.length === 0) {
		const container = document.getElementById('friendRequestsDiv');
		container?.remove();
	}

	// getFriendsList(1);
}