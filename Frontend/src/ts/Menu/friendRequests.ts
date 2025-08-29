import { Game } from "../gameData.js";

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
	if (!body) return;
	body.appendChild(friendRequestsDiv);
}

export function showFriendRequests(requests: any) {
	if (!friendRequestsDiv)
		initFriendRequestsContainer();
	if (!friendRequestsDiv)
		return;

	friendRequestsDiv.innerHTML = '';

	const title = document.createElement('div');
	title.textContent = "Friend Requests";
	title.style.fontWeight = 'bold';
	title.style.fontSize = '1.2rem';
	title.style.marginBottom = '0.5rem';
	friendRequestsDiv.appendChild(title);

	for (const req of requests) {
		const div = document.createElement('div');
		div.style.background = '#fff';
		div.style.padding = '0.6rem';
		div.style.borderRadius = '6px';
		div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
		div.style.display = 'flex';
		div.style.justifyContent = 'space-between';
		div.style.alignItems = 'center';
		div.style.fontSize = '1rem';
		div.classList.add('friend-request-item');
		div.dataset.requestId = req.id.toString();

		const nameSpan = document.createElement('span');
		nameSpan.textContent = req.requester_name;
		div.appendChild(nameSpan);

		const buttonContainer = document.createElement('div');

		const acceptBtn = document.createElement('button');
		acceptBtn.textContent = '✓';
		acceptBtn.style.marginRight = '0.3rem';
		acceptBtn.style.fontSize = '0.9rem';
		acceptBtn.onclick = () => handleFriendRequest(req.id, 'accept');

		const denyBtn = document.createElement('button');
		denyBtn.textContent = '✗';
		denyBtn.style.fontSize = '0.9rem';
		denyBtn.onclick = () => handleFriendRequest(req.id, 'deny');

		buttonContainer.appendChild(acceptBtn);
		buttonContainer.appendChild(denyBtn);
		div.appendChild(buttonContainer);

		friendRequestsDiv.appendChild(div);
	};
}

function handleFriendRequest(requestId: number, acceptOrDeny: string) {
	console.log(`Friend request ${requestId} ${acceptOrDeny}`);
	Game.socket.send({
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