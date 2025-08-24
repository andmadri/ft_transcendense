import { navigateTo } from "../history.js";
import { styleElement } from "./menuContent.js";

export function showCreditsPage() {
	if (document.getElementById('creditDiv'))
		return ;

	const app = document.getElementById('app');
	if (!app)
		return ;

	const creditDiv = document.createElement('div');
	creditDiv.id = 'creditDiv';
	styleElement(creditDiv, {
		position: 'fixed',
		width: '100vw',
		height: '100vh',
		top: '0',
		left: '0',
		backgroundColor: 'white',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: '9999'
	})


	const creditImg = document.createElement('img');
	creditImg.src = "./../images/Credits.png";
	styleElement(creditImg, {
		maxWidth: '90vw',
		maxHeight: '90vh',
		objectFit: 'contain',
	})

	const closeBtn = document.createElement('button');
	closeBtn.textContent = "CLOSE";
	closeBtn.style.zIndex = '100000';
	closeBtn.style.margin = '10px';

	creditDiv.appendChild(creditImg);
	creditDiv.appendChild(closeBtn);
	app.appendChild(creditDiv);

	closeBtn.addEventListener('click', () => {
		document.getElementById("creditDiv")?.remove();
		navigateTo("Menu");
	});
}

export function getCreditBtn(): HTMLDivElement {
	const creditsBtn = document.createElement('div');
	creditsBtn.textContent = 'Credits';
	styleElement(creditsBtn, {
		backgroundColor: '#d9f0ff',
		border: '2px solid #d9f0ff',
		padding: '15px',
		fontSize: '1em',
		cursor: 'pointer',
		marginRight: '15px',
		borderRadius: '10px',
		textAlign: 'center',
		width: '40%',
	});

	creditsBtn.addEventListener('click', () => { navigateTo('Credits') })
	return (creditsBtn);
}
