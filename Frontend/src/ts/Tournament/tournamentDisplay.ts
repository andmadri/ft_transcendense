import { requestLeaveTournament, requestUpdateTournament } from './tournamentContent.js';
import { readyTournamentPlayer, notReadyTournamentPlayer } from './tournamentContent.js';
import { UI } from '../gameData.js';
import { createBackgroundText } from '../Menu/menuContent.js';

function createButton():HTMLButtonElement {
	const readyBtn = document.createElement('button');
	readyBtn.textContent = 'Ready?';
	readyBtn.style.border = 'none';
	readyBtn.style.borderRadius = '5px';
	readyBtn.style.color = 'white';
	readyBtn.style.background = '#4a4a4a';
	readyBtn.style.width = '80%';
	readyBtn.style.marginTop = '0.5rem';

	let isReady = false;

	readyBtn.addEventListener('click', () => {
		isReady = !isReady;
		if (isReady) {
			readyTournamentPlayer();
			readyBtn.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
			readyBtn.style.color = 'black';
			readyBtn.textContent = 'Starting Soon';
		} else {
			notReadyTournamentPlayer();
			readyBtn.style.background = '#4a4a4a';
			readyBtn.style.color = 'white';
			readyBtn.textContent = 'Ready?';
		}
	});
	return readyBtn;
}

function updateButton(player: any, match:any, box: HTMLElement) {
	const parent = box.parentElement;
	if (!parent)
		return;
	const existingBtn = parent.querySelector('button');
	const isUserInMathc = UI.user1.ID === match?.player1.ID || UI.user1.ID === match?.player2.ID;
	console.log(`This is the match: ${match}`);
	if (existingBtn && isUserInMathc) {
		existingBtn.remove();
		return;
	}

	if (player?.name === UI.user1.name && !existingBtn) {
		parent.appendChild(createButton());
	}
}

export function updateNameTagsTournament(tournamentState: any) {
	const playerBoxIds = ['player1Box', 'player2Box', 'player3Box', 'player4Box'];
	const players = tournamentState.players || [];
	const matches = tournamentState.matches || [];

	const getName = (id: number) => tournamentState.players?.find((p: any) => p.id === id)?.name || '-';

	playerBoxIds.forEach((boxId, index) => {
		const box = document.getElementById(boxId);
		// console.log(boxId);
		// console.log(index);
		const player = players[index];
		const match = matches[index];
		if (box) {
			console.log('box exist');
			box.textContent = player?.name || 'Waiting...';
			updateButton(player, match, box);
		}
	});

	const winner1Box = document.getElementById('winner1Box');
	if (winner1Box) {
		const winner1ID = matches[0]?.winnerId;
		const winner1Player = players.find((p: any) => p.id === winner1ID);
		winner1Box.textContent = getName(winner1ID);
		updateButton(winner1Player, matches[4], winner1Box);
	}

	const winner2Box = document.getElementById('winner2Box');
	if (winner2Box) {
		const winner2ID = matches[1]?.winnerId;
		const winner2Player = players.find((p: any) => p.id === winner2ID);
		winner2Box.textContent = getName(winner2ID);
		updateButton(winner2Player, matches[4], winner2Box); 
	}

	const loser1Box = document.getElementById('loser1Box');
	if (loser1Box) {
		const loser1ID = matches[0]?.winnerId === matches[0]?.player1.ID
			? matches[0]?.player2.ID
			: matches[0]?.player1.ID;
		const loser1Player = players.find((p: any) => p.id === loser1ID);
		loser1Box.textContent = getName(loser1ID);
		updateButton(loser1Player, matches[3], loser1Box);
	}

	const loser2Box = document.getElementById('loser2Box');
	if (loser2Box) {
		const loser2ID = matches[1]?.winnerId === matches[1]?.player1.ID
				? matches[1]?.player2.ID
				: matches[1]?.player1.ID;
		const loser2Player = players.find((p: any) => p.id === loser2ID);
		loser2Box.textContent = getName(loser2ID);
		updateButton(loser2Player, matches[3], loser2Box); 
	}
}

export function showTournamentScreen() {
	const body = document.getElementById('body');
	if (!body) return;
	body.innerHTML = '';
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.display = 'flex'
	body.style.justifyContent = 'center';
	body.style.alignItems = 'center';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';

	createBackgroundText(body);

	const tournamentContainer = document.createElement('div');
	tournamentContainer.id = 'tournamentScreen';
	tournamentContainer.style.padding = '0.5rem';
	tournamentContainer.style.background = '#363430';
	tournamentContainer.style.gap = '1rem';
	tournamentContainer.style.width = 'clamp(500px, 800px, 900px)';
	tournamentContainer.style.aspectRatio = '2.35 / 1';
	tournamentContainer.style.flexDirection = 'column';
	tournamentContainer.style.borderRadius = '5px';
	tournamentContainer.style.margin = '0.5rem';
	tournamentContainer.style.flexDirection = 'row';
	tournamentContainer.style.position = 'relative';

	const title = document.createElement('div');
	title.textContent = `Tournament`;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.fontSize = 'clamp(20px 2.5vw 30px)';
	title.style.display = 'flex';
	title.style.justifyContent = 'flex-start';
	title.style.alignItems = 'center';
	title.style.color = 'white';
	tournamentContainer.appendChild(title);

	const bracketContainer = document.createElement('div');
	bracketContainer.style.display = 'flex';
	bracketContainer.style.justifyContent = 'space-between';
	bracketContainer.style.alignItems = 'center';
	bracketContainer.style.flex = '1';
	bracketContainer.style.gap = '2rem';
	bracketContainer.style.padding = '0.2rem';
	bracketContainer.style.position = 'relative';

	const createMatchBox = (player1BoxId: string, player2BoxId: string) => {
		const matchBox = document.createElement('div');
		matchBox.style.display = 'flex';
		matchBox.style.flexDirection = 'column';
		matchBox.style.gap = '0.5rem';
		matchBox.style.alignItems = 'center';

		const player1Box = document.createElement('div');
		player1Box.id = player1BoxId;
		player1Box.textContent = 'Waiting...';
		player1Box.style.background = '#4a4a4a';
		player1Box.style.color = 'white';
		player1Box.style.padding = '0.75rem 1rem';
		player1Box.style.borderRadius = '5px';
		player1Box.style.textAlign = 'center';
		player1Box.style.minWidth = '120px';
		player1Box.style.fontFamily = '"RobotoCondensed", sans-serif';

		const separator = document.createElement('div');
		separator.textContent = 'VS';
		separator.style.color = 'transparent';
		separator.style.fontSize = '0.8rem';
		separator.style.webkitTextStroke = '0.05rem #ffc433'
		separator.style.fontFamily = '"Horizon", sans-serif';

		const player2Box = document.createElement('div');
		player2Box.id = player2BoxId;
		player2Box.textContent = 'Waiting...';
		player2Box.style.background = '#4a4a4a';
		player2Box.style.color = 'white';
		player2Box.style.padding = '0.75rem 1rem';
		player2Box.style.borderRadius = '5px';
		player2Box.style.textAlign = 'center';
		player2Box.style.minWidth = '120px';
		player2Box.style.fontFamily = '"RobotoCondensed", sans-serif';

		matchBox.appendChild(player1Box);
		matchBox.appendChild(separator);
		matchBox.appendChild(player2Box);
		return matchBox;
	};

	const roundSection = (roundTitle: string, player1BoxId: string, player2BoxId: string) => {
		const section = document.createElement('div');
		section.style.display = 'flex';
		section.style.flexDirection = 'column';
		section.style.alignItems = 'center';
		section.style.gap = '1.5rem';
		
		const title = document.createElement('div');
		title.textContent = roundTitle;
		title.style.color = 'transparent'
		title.style.margin = '0';
		title.style.fontFamily = '"Horizon", sans-serif';
		title.style.fontSize = 'clamp(10px, 13px, 18px)';
		title.style.webkitTextStroke = '0.05rem #ffffffff'
		title.style.textAlign = 'center';
		
		section.appendChild(title);
		const matchBox = createMatchBox(player1BoxId, player2BoxId);
		section.appendChild(matchBox);
		return section;
	};

	const createArrow = (fromX: string, fromY: string, toX: string, toY: string, color: string = '#ffc433') => {
		const arrow = document.createElement('div');
		arrow.style.position = 'absolute';
		arrow.style.left = fromX;
		arrow.style.top = fromY;
		arrow.style.width = `calc(${toX} - ${fromX})`;
		arrow.style.height = '2px';
		arrow.style.background = color;
		arrow.style.transformOrigin = 'left center';
		const deltaX = parseFloat(toX.replace('%', '')) - parseFloat(fromX.replace('%', ''));
		const deltaY = parseFloat(toY.replace('%', '')) - parseFloat(fromY.replace('%', ''));
		const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
		const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		arrow.style.width = length + '%';
		arrow.style.transform = `rotate(${angle}deg)`;

		const arrowhead = document.createElement('div');
		arrowhead.style.position = 'absolute';
		arrowhead.style.right = '-6px';
		arrowhead.style.top = '-4px';
		arrowhead.style.width = '0';
		arrowhead.style.height = '0';
		arrowhead.style.borderLeft = `6px solid ${color}`;
		arrowhead.style.borderTop = '4px solid transparent';
		arrowhead.style.borderBottom = '4px solid transparent';
		
		arrow.appendChild(arrowhead);
		return arrow;
	};

	const round1Section = roundSection('Round 1', 'player1Box', 'player2Box');
	round1Section.style.flex ='1';
	
	const round2Section = roundSection('Round 2', 'player3Box', 'player4Box');
	round2Section.style.flex ='1';

	const middleSection = document.createElement('div');
	middleSection.style.display = 'flex';
	middleSection.style.flexDirection = 'column';
	middleSection.style.alignItems = 'center';
	middleSection.style.gap = '3rem';
	middleSection.style.flex = '1';

	const winnersSection = roundSection('Winners Final', 'winner1Box', 'winner2Box');

	const losersSection = roundSection('Losers Final', 'loser1Box', 'loser2Box');

	middleSection.appendChild(winnersSection);
	middleSection.appendChild(losersSection);
	
	const leaveBtn = document.createElement('button');
	leaveBtn.textContent = 'Leave Tournament';
	leaveBtn.style.border = 'none';
	leaveBtn.style.borderRadius = '5px';
	leaveBtn.style.color = 'white';
	leaveBtn.style.fontFamily = '"RobotoCondensed", sans-serif';
	leaveBtn.style.background = '#4a4a4a';
	leaveBtn.onclick = () => requestLeaveTournament();

	// Arrow from Round 1 to Winners (winner arrow - green)
	const arrow1ToWinners = createArrow('25%', '35%', '42%', '25%', '#00ff00');
	bracketContainer.appendChild(arrow1ToWinners);
	
	// Arrow from Round 1 to Losers (loser arrow - red)
	const arrow1ToLosers = createArrow('25%', '65%', '42%', '75%', '#ff4444');
	bracketContainer.appendChild(arrow1ToLosers);
	
	// Arrow from Round 2 to Winners (winner arrow - green)
	const arrow2ToWinners = createArrow('75%', '35%', '58%', '25%', '#00ff00');
	bracketContainer.appendChild(arrow2ToWinners);
	
	// Arrow from Round 2 to Losers (loser arrow - red)
	const arrow2ToLosers = createArrow('75%', '65%', '58%', '75%', '#ff4444');
	bracketContainer.appendChild(arrow2ToLosers);

	tournamentContainer.appendChild(leaveBtn);
	bracketContainer.appendChild(round1Section);
	bracketContainer.appendChild(middleSection);
	bracketContainer.appendChild(round2Section);
	tournamentContainer.appendChild(bracketContainer);
	body.appendChild(tournamentContainer);
	requestUpdateTournament();
}