import { requestLeaveTournament, requestUpdateTournament } from './tournamentContent.js';
import { readyTournamentPlayer, notReadyTournamentPlayer } from './tournamentContent.js';
import { UI } from '../gameData.js';
import { createBackgroundText } from '../Menu/menuContent.js';
import { pressButton } from '../windowEvents.js';
import { navigateTo } from '../history.js';
import { styleSettingTitle } from '../opponentTypeMenu/opponentType.js';

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

function isUserInMatch(match: any) {
	return match && (UI.user1.ID === match?.player1 || UI.user1.ID === match?.player2);
}

function isMatchStarted(match: any) {
	if (match) {
		console.log('match exists');
	}
	return match;
}

function updateButton(player: any, match:any, box: HTMLElement) {
	console.log(`${match}`);
	const parent = box.parentElement;
	if (!parent) {
		// console.log('no parent');
		return;
	}
	const existingBtn = parent.querySelector('button');
	// if (existingBtn){
	// 	console.log(`existingBTN exists`);
	// }
	// else if (match) {
	// 	console.log(`existingBTN does not exist - match does`);
	// 	console.log(`box exists - playedID = ${player.id} - boxID = ${box}`);
	// }
	if (existingBtn && isMatchStarted(match)) {
		console.log('This button should be removed');
		existingBtn.remove();
		return;
	}

	if (player?.name === UI.user1.name && !existingBtn && !match) {
		console.log('Button created');
		parent.appendChild(createButton());
	}
}

function getName(id: number, players: any) {
	return players.find((p: any) => p.id === id)?.name || '';
}

export function updateNameTagsTournament(tournamentState: any) {
	//check if the matches array length is bigger than 2 and if so check if the
	const playerBoxIds = ['player1Box', 'player2Box', 'player3Box', 'player4Box'];
	const players = tournamentState.players || [];
	const matches = tournamentState.matches || [];
	const round1 = matches[0] || null ;
	const round2 = matches[1] || null ;

	// const getName = (id: number) => tournamentState.players?.find((p: any) => p.id === id)?.name || '-';

	playerBoxIds.forEach((boxId, index) => {
		const box = document.getElementById(boxId);
		const player = players[index];
		let playerMatch = null;
			console.log('round1 and round2 exist');
			if (round1 && (player.id === round1.player1 || player.id === round1.player2))
				playerMatch = round1;
			else if (round2 && (player.id === round2.player1 || player.id === round2.player2)) {
				playerMatch = round2;
			}
		if (box) {
			box.textContent = player?.name || 'Waiting...';
			if (players.length == 4) {
				console.log(`box exists - playedID = ${player.id} - boxID = ${boxId}`);
				//only if there are four players you should have a button otherwise weird things happen if someone presses the button and there are no four players
				updateButton(player, playerMatch, box);
			}
			else {
				//if there were four people but someone leaves
				box.parentElement?.querySelector('button')?.remove();
			}
		}
	});

	const winner1Box = document.getElementById('winner1Box');
	if (winner1Box) {
		const winner1ID = matches[0]?.winnerID;
		const winner1Player = players.find((p: any) => p.id === winner1ID);
		winner1Box.textContent = getName(winner1ID, tournamentState.players);
		let winner_match = null;
		if (matches[3] && matches[3].matchNumber === 4)
			winner_match = matches[3];
		else if (matches[2] && matches[2].matchNumber === 4)
			winner_match = matches[2];
		updateButton(winner1Player, winner_match, winner1Box); //winnermatch is not necessarily index 4 -> winnermatch is matchNumber 3
	}

	//matches[3] == match.matchNumber3?
	// matches = [Round2, round1, losers, winers]
	const winner2Box = document.getElementById('winner2Box');
	if (winner2Box) {
		const winner2ID = matches[1]?.winnerID;
		const winner2Player = players.find((p: any) => p.id === winner2ID);
		winner2Box.textContent = getName(winner2ID, tournamentState.players);
		//function to find the match for corresponding match number
		let winner_match = null;
		if (matches[3] && matches[3].matchNumber === 4)
			winner_match = matches[3];
		else if (matches[2] && matches[2].matchNumber === 4)
			winner_match = matches[2];
		updateButton(winner2Player, winner_match, winner2Box); 
	}

	const loser1Box = document.getElementById('loser1Box');
	if (loser1Box) {
		const loser1ID = matches[0]?.winnerID === matches[0]?.player1
			? matches[0]?.player2
			: matches[0]?.player1;
		const loser1Player = players.find((p: any) => p.id === loser1ID);
		loser1Box.textContent = getName(loser1ID, tournamentState.players);
		let losers_match = null;
		if (matches[3] && matches[3].matchNumber === 3)
			losers_match = matches[3];
		else if (matches[2] && matches[2].matchNumber === 3)
			losers_match = matches[2];
		updateButton(loser1Player, losers_match, loser1Box);
	}

	const loser2Box = document.getElementById('loser2Box');
	if (loser2Box) {
		const loser2ID = matches[1]?.winnerID === matches[1]?.player1
				? matches[1]?.player2
				: matches[1]?.player1;
		const loser2Player = players.find((p: any) => p.id === loser2ID);
		loser2Box.textContent = getName(loser2ID, tournamentState.players);
		let losers_match = null;
		if (matches[3] && matches[3].matchNumber === 3)
			losers_match = matches[3];
		else if (matches[2] && matches[2].matchNumber === 3)
			losers_match = matches[2];
		updateButton(loser2Player, losers_match, loser2Box); 
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


function styleText(playerName: string): HTMLDivElement {
	const playerNamePodium = document.createElement('div');
	playerNamePodium.textContent = playerName
	playerNamePodium.style.fontFamily = '"Horizon", sans-serif';
	playerNamePodium.style.fontSize = 'clamp(13px, 1.7vw, 18px)';
	playerNamePodium.style.textAlign = 'center';
	playerNamePodium.style.alignItems = 'center';
	playerNamePodium.style.justifyContent = 'flex-start';
	playerNamePodium.style.color = 'black';
	return playerNamePodium;
}

export function showTournamentEndScreen(tournamentState: any) {
	let winner_match = (tournamentState.matches[3].matchNumber == 4 ? tournamentState.matches[3] : tournamentState.matches[2]);
	let loser_match = (tournamentState.matches[2].matchNumber == 3 ? tournamentState.matches[2] : tournamentState.matches[3]);

	const winner1Name = getName(winner_match.winnerID, tournamentState.players);
	const winner2Name = getName((winner_match.winnerID === winner_match.player1 ? winner_match.player2 : winner_match.player1), tournamentState);
	const Loser1Name = getName(loser_match.winnerID, tournamentState.players);
	const Loser2Name = getName((loser_match.winnerID === loser_match.player1 ? loser_match.player2 : loser_match.player1), tournamentState);

	const body = document.getElementById('body');
	if (!body)
		return ;

	if (!document.getElementById('tournamentScreen')) {
		showTournamentScreen();
	}

	const tournamentEndScreen = document.createElement('div');
	tournamentEndScreen.id = 'tournamentEndScreen';
	tournamentEndScreen.style.width = '100%';
	tournamentEndScreen.style.height = '100%';
	tournamentEndScreen.style.margin = '0';
	tournamentEndScreen.style.top = '0';
	tournamentEndScreen.style.left = '0';
	tournamentEndScreen.style.display = 'flex';
	tournamentEndScreen.style.justifyContent = 'center';
	tournamentEndScreen.style.alignItems = 'center';
	tournamentEndScreen.style.backdropFilter = 'blur(6px)';
	tournamentEndScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.25)'; 
	tournamentEndScreen.style.position = 'fixed';
	tournamentEndScreen.style.zIndex = '100';

	tournamentEndScreen.addEventListener('click', (e) => {
		if (e.target === tournamentEndScreen) {
			navigateTo('Menu');
		}
	});

	const blackContainer = document.createElement('div');
	blackContainer.style.aspectRatio = '3 / 2';
	blackContainer.style.width = 'clamp(350px, 40vh, 500px)';
	blackContainer.style.borderRadius = '10px';
	blackContainer.style.padding = '0.7rem';
	blackContainer.style.background = 'black';
	blackContainer.style.justifyContent = 'center';
	blackContainer.style.gap = '0.7rem';
	blackContainer.style.display = 'flex';
	blackContainer.style.flexDirection = 'column';
	blackContainer.style.borderRadius = '10px';
	blackContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
	blackContainer.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	const playerPodium = document.createElement('div');
	playerPodium.id = 'playerPodium';
	playerPodium.style.borderRadius = '5px';
	playerPodium.style.color = 'black';
	playerPodium.style.gap = '2.5rem';
	playerPodium.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	playerPodium.style.alignItems = 'center';
	playerPodium.style.justifyContent = 'center';
	playerPodium.style.flex = '1 1';
	playerPodium.style.display = 'flex';
	playerPodium.style.flexDirection = 'column';

	const playerPodiumTitle = styleSettingTitle('Player Podium');
	const firstPlace = styleText('#1'+ winner1Name);
	const secondPlace = styleText('#2'+ winner2Name);
	const thirdPlace = styleText('#3'+ Loser1Name);
	const fourthPlace = styleText('#4'+ Loser2Name);
	
	playerPodium.appendChild(playerPodiumTitle);
	playerPodium.append(firstPlace, secondPlace, thirdPlace, fourthPlace);
	blackContainer.appendChild(playerPodium);

	tournamentEndScreen.appendChild(blackContainer);
	body.append(tournamentEndScreen);
}