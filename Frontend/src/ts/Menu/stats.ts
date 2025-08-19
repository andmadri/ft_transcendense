import { Game } from '../script.js'
import { styleElement } from './menuContent.js'

function createStatsList(): HTMLDivElement {
	const stats = document.createElement('div');
	stats.id = 'stats';
	styleElement(stats, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		textAlign: 'center',
		borderRadius: '10px',
		flex: '1'
	});
	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Stats';

	const list = document.createElement('div');
	list.id = 'listStats';

	const html_list = document.createElement('ul');
	html_list.id = 'htmllistStats';
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	stats.append(title, list);
	return (stats);
}

export function getStatsList(playerNr: number): HTMLDivElement {
	let stats = document.getElementById('stats') as HTMLDivElement;

	if (!stats)
		stats = createStatsList();
	else {
		const list = document.getElementById('htmllistStats');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	Game.socket.send({
		action: 'stats', 
		subaction: 'getStats', 
		player: playerNr
	});

	return (stats);
}
