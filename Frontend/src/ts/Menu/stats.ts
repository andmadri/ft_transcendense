import { Game } from '../script.js'
import { styleElementMenu } from './menuContent.js'

function createStatsList(): HTMLDivElement {
	const stats = document.createElement('div');
	stats.id = 'stats';
	styleElementMenu(stats, {
		backgroundColor: 'white',
		border: '2px solid black',
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

export function getStatsList(): HTMLDivElement {
	let stats = document.getElementById('stats') as HTMLDivElement;

	if (!stats)
		stats = createStatsList();
	else {
		const list = document.getElementById('htmllistStats');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	const msg = {action: 'stats', subaction: 'getStats', player: Game.id};
	Game.socket.send(JSON.stringify(msg));

	return (stats);
}
