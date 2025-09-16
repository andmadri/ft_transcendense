import { get } from "http";
import { Game, UI } from "../gameData.js";
import { responseChallenge } from "../Matchmaking/challengeFriend.js";

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

function getTitleRow(text: string): HTMLLIElement {
	const row = document.createElement('li');
	row.textContent = text;
	row.style.fontFamily = '"RobotoCondensed", sans-serif';
	row.style.background = 'transparent';
	row.style.padding = '12px 16px';
	row.style.borderRadius = '0';
	row.style.color = 'white';
	row.style.display = 'flex';
	row.style.justifyContent = 'space-between';
	row.style.fontSize = '20px';
	row.style.cursor = 'default';
	row.style.fontWeight = 'bold';
	return (row);
}

function getRow(req: any, isFriendRequest: boolean): HTMLLIElement {
	const row = document.createElement('li');
	row.id = `row${req.id}`;
	row.style.fontFamily = '"RobotoCondensed", sans-serif';
	row.style.background = 'transparent';
	row.style.padding = '12px 16px';
	row.style.borderRadius = '0';
	row.style.color = 'white';
	row.style.display = 'flex';
	row.style.justifyContent = 'space-between';
	row.style.alignItems = 'center';
	row.style.cursor = 'default';
	row.style.fontSize = '20px';
	row.dataset.requestId = req.id;

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
		if (isFriendRequest) {
			handleFriendRequest(req.id, 'accept');
		} else {
			responseChallenge(true, req);
		}
		document.getElementById(`row${req.id}`)?.remove();
		updateNotificationBadge(0, true);
	};

	const denyBtn = document.createElement('button');
	denyBtn.textContent = '✗';
	denyBtn.style.borderRadius = '50%';
	denyBtn.style.borderRadius = '"Horizon", sans-serif';
	denyBtn.style.background = '#ffc233'
	denyBtn.style.border = 'none';
	denyBtn.onclick = () => {
		if (isFriendRequest) {
			handleFriendRequest(req.id, 'deny');
		} else {
			responseChallenge(false, req);
		}
		document.getElementById(`row${req.id}`)?.remove();
		updateNotificationBadge(0, true);
	}
	buttonContainer.append(acceptBtn, denyBtn);
	row.appendChild(buttonContainer);
	return (row);
}

export function showFriendAndChallengeRequests(friendRequest: any, invites: any) {
	const notificationBtnList = document.getElementById('notificationBtnList');
	if (!notificationBtnList)
		return ;
	notificationBtnList.innerHTML = '';
	notificationBtnList.style.gap = '0.5rem';
	notificationBtnList.style.overflowY = 'auto';

	updateNotificationBadge(friendRequest.length + invites.length, false);

	if (friendRequest.length > 0) {
		const rowForFriendRequests = getTitleRow('Friend Requests:');
		notificationBtnList.appendChild(rowForFriendRequests);
		for (const req of friendRequest) {
			const row = getRow(req, true);
			notificationBtnList.appendChild(row);
		}
	}

	if (invites.length > 0) {
		const rowForChallengeRequests = getTitleRow('Game Challenges:');

		notificationBtnList.appendChild(rowForChallengeRequests);
		for (const friendInvite of invites.values()) {
			const row = getRow(friendInvite, false);
			notificationBtnList.appendChild(row);
		}
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
}