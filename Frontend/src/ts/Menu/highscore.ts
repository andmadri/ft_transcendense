// import { styleElement } from "./menuContent.js";
import { Game } from '../script.js'

function createHighscores(): HTMLDivElement {
	const highscores = document.createElement('div');
	highscores.id = 'online';
	// 	styleElement(highscores, {
	// 	backgroundColor: 'white',
	// 	padding: '20px',
	// 	textAlign: 'center',
	// 	flex: '1',
	// 	borderRadius: '10px'
	// });

	const title = document.createElement('h2');
	title.className = 'sectionTitle';
	title.textContent = 'Highscores';

	const list = document.createElement('div');
	list.id = 'listHighscores';


	const html_list = document.createElement('ul');
	html_list.id = 'htmllistHighscores';
	html_list.className = 'online-markers';

	list.appendChild(html_list);
	highscores.append(title, list);
	return (highscores);	
}

export function getHighscores(): HTMLDivElement {
	let highscores = document.getElementById('highscores') as HTMLDivElement;
	
	if (!highscores)
		highscores = createHighscores();
	else {
		const list = document.getElementById('htmllistHighscores');
		if (list instanceof HTMLUListElement)
			list.innerHTML = '';
	}

	const msg = {action: 'highscores', subaction: 'getHighscores'};
	Game.socket.send(JSON.stringify(msg));

	return (highscores);
}