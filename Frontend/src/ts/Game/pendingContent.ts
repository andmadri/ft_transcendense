import { cancelOnlineMatch } from '../Matchmaking/onlineMatch.js';
import { navigateTo } from "../history.js";

export function getPending() {
	const Pending = document.createElement('div');
	Pending.id = 'Pending';
	Pending.style.display = 'flex';
	Pending.style.flexDirection = 'column';
	Pending.style.alignItems = 'center';
	Pending.style.justifyContent = 'center';
	Pending.style.position = 'relative';
	Pending.style.backgroundColor = 'transparent';
	Pending.style.fontFamily = '"Horizon", monospace';
	Pending.style.textAlign = 'center';
	Pending.style.width = '100%';
	Pending.style.height = '100%';

	const txtPending = document.createElement('div');
	txtPending.textContent = "Pending...";
	txtPending.style.color = 'transparent';
	txtPending.style.fontSize = '10vw';
	txtPending.style.webkitTextStroke = '0.2rem #000';

	const	ball = document.createElement('div');
	ball.id = 'ballEndCredits';
	ball.style.position = 'absolute';
	ball.style.top = '47.5%';
	ball.style.left = '47.5%';
	ball.style.width = '5%';
	ball.style.aspectRatio = '1 / 1';
	ball.style.backgroundColor = '#ededeb';
	ball.style.borderRadius = '50%';
	ball.style.boxShadow = '0.25rem 0.375rem 0.625rem';
	ball.style.animation = 'goX 2.2s linear 0s infinite alternate, goY 3.5s linear 0s infinite alternate';

	Pending.appendChild(txtPending);
	Pending.appendChild(ball);

	const backToMenu = document.createElement('button');
	backToMenu.id = 'menuBtn';
	backToMenu.textContent = 'Back to menu';
	backToMenu.style.fontFamily = '"Horizon", monospace';
	backToMenu.style.padding = '0.6rem 2rem';
	backToMenu.style.fontSize = '1.5rem';
	backToMenu.style.borderRadius = '0.8rem';
	backToMenu.style.border = '0.15rem solid black';
	backToMenu.style.backgroundColor = '#ededeb';
	backToMenu.style.boxShadow = '0.25rem 0.375rem 0.625rem rgba(0,0,0,0.3)';
	backToMenu.style.cursor = 'pointer';
	backToMenu.style.transition = 'all 0.2s ease-in-out';

	backToMenu.addEventListener('click', () => {
		cancelOnlineMatch();
		navigateTo('Menu'); 
	})
	Pending.appendChild(backToMenu);

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.innerHTML = "";
	body.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)'
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.overflow = 'hidden';
	body.appendChild(Pending);
}