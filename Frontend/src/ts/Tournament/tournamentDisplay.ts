import { requestLeaveTournament } from './tournamentContent.js';


//create a lobby
//as long as the tournament state is waiting show the lobby
//while it is on waiting you can leave
//if no progress get an alert
//tournamentState.players[0].name = this would be player1
export function showTournamentScreen(tournamentState: any) {
	const body = document.getElementById('body');
	if (!body) return;
	body.innerHTML = '';
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';

	const tournamentContainer = document.createElement('div');
	tournamentContainer.id = 'tournamentScreen';
	tournamentContainer.style.padding = '0.5rem';
	tournamentContainer.style.background = '#363430';
	tournamentContainer.style.gap = '1rem';
	tournamentContainer.style.width = 'clamp(300px 50vw 600px)';
	tournamentContainer.style.aspectRatio = '2.35 / 1';
	tournamentContainer.style.flexDirection = 'column';
	tournamentContainer.style.borderRadius = '10px';

	const title = document.createElement('div');
	//do we have an id for the tournament?
	title.textContent = `Tournament: XXX`;
	title.style.fontFamily = '"Horizon", sans-serif';
	title.style.fontSize = 'clamp(20px 2.5vw 30px)';
	title.style.display = 'flex';
	title.style.justifyContent = 'center';
	title.style.alignItems = 'flex-start';
	title.style.color = 'white';
	title.style.marginBottom = '2rem';
	tournamentContainer.appendChild(title);

	const bracketContainer = document.createElement('div');
	bracketContainer.style.display = 'flex';
	bracketContainer.style.justifyContent = 'space-between';
	bracketContainer.style.alignItems = 'center';
	bracketContainer.style.flex = '1';
	bracketContainer.style.gap = '2rem';
	bracketContainer.style.padding = '0.2rem';

	// Leave Tournament button
	const leaveBtn = document.createElement('button');
	leaveBtn.textContent = 'Leave Tournament';
	leaveBtn.style.marginBottom = '20px';
	leaveBtn.onclick = () => requestLeaveTournament();
	tournamentContainer.appendChild(leaveBtn);

	const getName = (id: number) => tournamentState.players?.find((p: any) => p.id === id)?.name || 'TBD';

	const createMatchBox = (player1Name: string, player2Name: string, onReady?: () => void) => {
		const matchBox = document.createElement('div');
		matchBox.style.display = 'flex';
		matchBox.style.flexDirection = 'column';
		matchBox.style.gap = '0.5rem';
		matchBox.style.alignItems = 'center';

		const player1Box = document.createElement('div');
		player1Box.textContent = player1Name;
		player1Box.style.background = '#4a4a4a';
		player1Box.style.color = 'white';
		player1Box.style.padding = '0.75rem 1rem';
		player1Box.style.borderRadius = '5px';
		player1Box.style.textAlign = 'center';
		player1Box.style.minWidth = '120px';
		player1Box.style.fontWeight = 'bold';
		player1Box.style.fontFamily = '"RobotoCondensed", sans-serif';

		const separator = document.createElement('div');
		separator.textContent = 'VS';
		separator.style.color = 'transparent';
		// separator.style.fontWeight = 'bold';
		separator.style.fontSize = '0.8rem';
		separator.style.webkitTextStroke = '0.2rem #ffc433'
		separator.style.fontFamily = '"Horizon", sans-serif';

		const player2Box = document.createElement('div');
		player2Box.textContent = player2Name;
		player1Box.style.background = '#4a4a4a';
		player1Box.style.color = 'white';
		player1Box.style.padding = '0.75rem 1rem';
		player1Box.style.borderRadius = '5px';
		player1Box.style.textAlign = 'center';
		player1Box.style.minWidth = '120px';
		player1Box.style.fontWeight = 'bold';
		player1Box.style.fontFamily = '"RobotoCondensed", sans-serif';

		const readyBtn = document.createElement('button');
		readyBtn.textContent = 'Join the Match';
		let isReady = false;
		readyBtn.addEventListener('click', () => {
			isReady = !isReady;
			if (isReady) {
				readyBtn.style.background = 'linear-gradient(45deg, #00ff00, #32cd32)';
				readyBtn.textContent = 'Ready!';
			} else {
				readyBtn.style.background = '#4a4a4a';
				readyBtn.textContent = 'Join the Match';
			}
			if (onReady)
				onReady();
		});
		matchBox.appendChild(player1Box);
		matchBox.appendChild(separator);
		matchBox.appendChild(player2Box);
		matchBox.appendChild(readyBtn);
		return matchBox;
	};
	
	const roundSection = (roundTitle: string, matches: any[]) => {
		const section = document.createElement('div');
		section.style.display = 'flex';
		section.style.flexDirection = 'column';
		section.style.alignItems = 'center';
		section.style.gap = '1.5rem';

		const title = document.createElement('h3');
		title.textContent = roundTitle; //roundTitle
		title.style.color = 'white'
		title.style.margin = '0';
		title.style.fontFamily = '"Horizon", sans-serif';
		title.style.fontSize = 'clamp(14px 1.5vw 18px)';
		title.style.textAlign = 'center';

		section.appendChild(title);

		matches.forEach(match => {
			const player1Name = getName(match.player1) || 'Waiting...';
			const player2Name = getName(match.player2) || 'Waiting...';
			const matchBox = createMatchBox(player1Name, player2Name);
			section.appendChild(matchBox);
		})
		return section;
	};

	const match1 = tournamentState.matches?.find((m: any) => m.matchNumber === 1);
	const match2 = tournamentState.matches?.find((m: any) => m.matchNumber === 2);
	const match3 = tournamentState.matches?.find((m: any) => m.matchNumber === 3);
	const match4 = tournamentState.matches?.find((m: any) => m.matchNumber === 4);

	const round1Section = roundSection('Round 1', [match1 || {}]);
	round1Section.style.flex ='1';

	const round2Section = roundSection('Round 2', [match2 || {}]);

	const middleSection = document.createElement('div');
	middleSection.style.display = 'flex';
	middleSection.style.flexDirection = 'column';
	middleSection.style.alignItems = 'center';
	middleSection.style.gap = '3rem';
	middleSection.style.flex = '1';

	const winnersSection = roundSection('Winners Final', [match4 || {}]);
	const losersSection = roundSection('Losers Final', [match3 || {}]);

	middleSection.appendChild(winnersSection);
	middleSection.appendChild(losersSection);

	bracketContainer.appendChild(round1Section);
	bracketContainer.appendChild(middleSection);
	bracketContainer.appendChild(round2Section);
	tournamentContainer.appendChild(bracketContainer);
	body.appendChild(tournamentContainer);
// 	const playersDiv = document.createElement('div');
// 	playersDiv.textContent = 'Players: ' + (tournamentState.players?.map((p: any) => p.name).join(', ') || 'Waiting...');
// 	playersDiv.style.marginBottom = '20px';
// 	container.appendChild(playersDiv);

// 	// Bracket visualization
// 	const bracketDiv = document.createElement('div');
// 	bracketDiv.style.display = 'flex';
// 	bracketDiv.style.flexDirection = 'column';
// 	bracketDiv.style.gap = '20px';

// 	// Helper to get player name by ID
// 	const getName = (id: number) =>
// 		tournamentState.players?.find((p: any) => p.id === id)?.name || 'TBD';

// 	// Game 1 & 2
// 	const g1 = tournamentState.matches?.find((m: any) => m.matchNumber === 1);
// 	const g2 = tournamentState.matches?.find((m: any) => m.matchNumber === 2);
// 	const g3 = tournamentState.matches?.find((m: any) => m.matchNumber === 3);
// 	const g4 = tournamentState.matches?.find((m: any) => m.matchNumber === 4);

// 	const matchRow = (label: string, m: any) => {
// 		const row = document.createElement('div');
// 		row.textContent = `${label}: ${getName(m?.player1)} vs ${getName(m?.player2)} ` +
// 			(m?.finished ? `(Winner: ${getName(m?.winner)})` : (m?.started ? '(In Progress)' : '(Waiting)'));
// 		return row;
// 	};

// 	bracketDiv.appendChild(matchRow('Game 1', g1));
// 	bracketDiv.appendChild(matchRow('Game 2', g2));
// 	bracketDiv.appendChild(matchRow('Game 3 (Losers)', g3));
// 	bracketDiv.appendChild(matchRow('Game 4 (Final)', g4));

// 	container.appendChild(bracketDiv);

// 	// Tournament state message
// 	const stateMsg = document.createElement('div');
// 	stateMsg.style.marginTop = '30px';
// 	stateMsg.style.fontWeight = 'bold';
// 	if (tournamentState.state === 'waiting') {
// 		stateMsg.textContent = 'Waiting for players...';
// 	} else if (tournamentState.state === 'in_progress') {
// 		stateMsg.textContent = 'Tournament in progress!';
// 	} else if (tournamentState.state === 'finished') {
// 		stateMsg.textContent = 'Tournament finished!';
// 	}
// 	container.appendChild(stateMsg);

// 	body.appendChild(container);
// }
}