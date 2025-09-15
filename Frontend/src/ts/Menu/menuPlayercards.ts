// import { styleElement } from "./menuContent.js";
// import { getRightSideMenu } from "./menuContent.js";
// import { Game } from "../gameData.js";
// import { getAuthField } from "../Auth/authContent.js";

// function getPlayerCard(playerNum: number): HTMLDivElement {
// 	const card = document.createElement('div');
// 	card.className = 'player-card';
// 	styleElement(card, {
// 		display: 'flex',
// 		flexDirection: 'column',
// 		gap: '10px',
// 		padding: '15px',
// 		backgroundColor: 'white',
// 		borderRadius: '10px',
// 		boxSizing: 'border-box',
// 		alignItems: 'center',
// 		height: '100%'
// 	});

// 	card.append(getRightSideMenu(playerNum));
// 	return card;
// }

// export function getRightSideMenuWithTabs() {
// 	const container = document.createElement('div');
// 	styleElement(container, {
// 		width: '58%',
// 		display: 'flex',
// 		flexDirection: 'column',
// 		alignItems: 'stretch',
// 	});

// 	// Tabs header
// 	const tabsHeader = document.createElement('div');
// 	styleElement(tabsHeader, {
// 		display: 'flex',
// 		borderBottom: '2px solid #ccc',
// 		marginBottom: '10px',
// 	});

// 	const tab1 = document.createElement('button');
// 	tab1.textContent = 'Player 1';
// 	styleElement(tab1, {
// 		flex: '1',
// 		padding: '10px',
// 		cursor: 'pointer',
// 		backgroundColor: '#eee',
// 		border: 'none',
// 		borderBottom: '2px solid #ffd400',
// 		fontWeight: 'bold',
// 	});
// 	const tab2 = document.createElement('button');
// 	tab2.textContent = 'Player 2';
// 	styleElement(tab2, {
// 		flex: '1',
// 		padding: '10px',
// 		cursor: 'pointer',
// 		backgroundColor: '#eee',
// 		border: 'none',
// 	});

// 	tabsHeader.append(tab1, tab2);

// 	// Tab content
// 	const card1 = getPlayerCard(1);
// 	const card2 = getPlayerCard(2);
// 	card2.style.display = 'none';

// 	// Tab switching logic
// 	tab1.onclick = () => {
// 		card1.style.display = '';
// 		card2.style.display = 'none';
// 		tab1.style.borderBottom = '2px solid #ffd400';
// 		tab2.style.borderBottom = 'none';
// 	};
// 	tab2.onclick = () => {
// 		card1.style.display = 'none';
// 		card2.style.display = '';
// 		tab1.style.borderBottom = 'none';
// 		tab2.style.borderBottom = '2px solid #ffd400';
// 	};

// 	container.append(tabsHeader, card1, card2);
// 	return container;
// }