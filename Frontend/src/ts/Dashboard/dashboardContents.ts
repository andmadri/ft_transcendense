import { Game } from '../script.js'
import * as S from '../structs.js'
//import something from database

export function getDashboard()
{
	const menu = document.getElementById('menu');
	if(menu)
		menu.remove();
	const optionMenu = document.getElementById('optionMenu');
	if (optionMenu)
		optionMenu.remove();

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.style.margin = '0';
	body.style.width = '100vw';
	body.style.height = '100vh';
	body.style.background = '#ededeb';

	const containerDashboard = document.createElement('div');
	containerDashboard.style.display = 'flex';
	containerDashboard.style.flexDirection = 'column';
	containerDashboard.id = 'containerDashboard';
	containerDashboard.style.width = '100%';
	containerDashboard.style.height = '100%';
	containerDashboard.style.position = 'relative';
	containerDashboard.style.alignItems = 'center';
	containerDashboard.style.justifyContent = 'center';
	containerDashboard.style.gap = '1.5%';
	// containerDashboard.style.textAlign = 'center';

	const dashboard = document.createElement('div');
	dashboard.id = 'dashboard';
	dashboard.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	dashboard.style.display = 'flex';
	dashboard.style.flexDirection = 'column';
	dashboard.style.aspectRatio = '4 / 3';
	dashboard.style.width = '80vw';
	dashboard.style.height = '70vh';
	dashboard.style.borderRadius = '16px';
	dashboard.style.position = 'relative';
	dashboard.style.boxSizing = 'border-box';
	// dashboard.style.justifyContent = 'space-between';
	dashboard.style.alignItems = 'flex-start';

	const title = document.createElement('div');
	title.id = 'dashboardTitle';
	title.textContent = 'Match History';
	title.style.fontFamily = '"Horizon", monospace';
	title.style.color = 'transparent';
	title.style.fontSize = 'clamp(1.5rem, 3.5rem, 5rem)';
	title.style.webkitTextStroke = '0.2rem #000';
	title.style.whiteSpace = 'nowrap';
	title.style.display = 'inline-block';
	title.style.background = 'linear-gradient(90deg, #ff6117, #ffc433, #ffc433)';
	title.style.borderRadius = '16px';
	title.style.width = '80vw';
	title.style.padding = '0.5rem';
	title.style.boxSizing = 'border-box';

	const headers = document.createElement('div');
	headers.id = 'dashboardHeaders';
	headers.style.display = 'flex';
	headers.style.width = "95%";
	headers.style.justifyContent = 'space-between';
	headers.style.alignContent = 'center';
	headers.style.alignItems = 'flex-start';
	headers.style.fontFamily = '"Horizon", monospace';
	headers.style.textAlign = 'left';

	const labels = ['Opponents', 'Date', 'Score', 'Duration', 'Total Hits'];
	labels.forEach(text => {
	const headerItem = document.createElement('div');
		headerItem.textContent = text;
		headerItem.style.flex = '1'; // Equal width for each column
		// headerItem.style.textAlign = 'center';
		headerItem.style.paddingLeft = '1rem';
		headers.appendChild(headerItem);
	})

	//data that I got from martijn
	// .forEch(text => {
	// 	const headerData = document.createElement('div');
	// 	headerData.textContent = text;
	// 	headerData.style.flex = '1';
	// })

	//I need a container that will have lines and if I click on one then 
	dashboard.appendChild(headers);
	containerDashboard.appendChild(title);
	containerDashboard.appendChild(dashboard);
	body.append(containerDashboard);
}