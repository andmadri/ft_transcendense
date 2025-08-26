import { Game } from "../gameData.js";

interface FriendRequest {
	id: number;
	requester_id: number;
	requester_name: string;
}

let friendRequestsContainer: HTMLDivElement | null = null;

export function initFriendRequestsContainer() {
	if (friendRequestsContainer)
		return;

	friendRequestsContainer = document.createElement('div');
	friendRequestsContainer.style.position = 'fixed';
	friendRequestsContainer.style.bottom = '1rem';
	friendRequestsContainer.style.right = '1rem';
	friendRequestsContainer.style.width = '250px';
	friendRequestsContainer.style.zIndex = '1000';
	friendRequestsContainer.style.display = 'flex';
	friendRequestsContainer.style.flexDirection = 'column';
	friendRequestsContainer.style.gap = '0.3rem';

	document.body.appendChild(friendRequestsContainer);
}

export function showFriendRequests(requests: FriendRequest[]) {
	if (!friendRequestsContainer)
		initFriendRequestsContainer();
	if (!friendRequestsContainer)
		return;

	friendRequestsContainer.innerHTML = '';

	requests.forEach(req => {
		const div = document.createElement('div');
		div.style.background = '#fff';
		div.style.padding = '0.5rem';
		div.style.borderRadius = '5px';
		div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
		div.style.fontSize = '0.9rem';
		div.style.display = 'flex';
		div.style.justifyContent = 'space-between';
		div.style.alignItems = 'center';

		const nameSpan = document.createElement('span');
		nameSpan.textContent = req.requester_name;
		div.appendChild(nameSpan);

		const buttonContainer = document.createElement('div');

		const acceptBtn = document.createElement('button');
		acceptBtn.textContent = '✓';
		acceptBtn.style.marginRight = '0.2rem';
		acceptBtn.onclick = () => handleFriendRequest(req.id, 'accept');

		const denyBtn = document.createElement('button');
		denyBtn.textContent = '✗';
		denyBtn.onclick = () => handleFriendRequest(req.id, 'deny');

		buttonContainer.appendChild(acceptBtn);
		buttonContainer.appendChild(denyBtn);
		div.appendChild(buttonContainer);

		friendRequestsContainer?.appendChild(div);
	});
}

function handleFriendRequest(requestId: number, acceptOrDeny: string) {
	console.log(`Friend request ${requestId} ${acceptOrDeny}`);
	Game.socket.send({
		action: 'friends',
		subaction: acceptOrDeny + 'FriendRequest',
		requestId			
	})
}