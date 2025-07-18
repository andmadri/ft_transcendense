
export function getLoadingPage() {
	const body = document.getElementById('body');
	if (!body)
		return;

	const page = document.createElement('div');
	page.id = "loadingpage";
	page.style.width = '100%';
	page.style.height = '100%';
	page.style.position = 'relative';
	page.style.backgroundImage = 'url("./../images/Background.jpg")';
	page.style.backgroundSize = 'cover';
	page.style.backgroundPosition = 'center';
	page.style.display = 'flex';
	page.style.justifyContent = 'center';
	page.style.alignItems = 'center';

	const loading = document.createElement('h1');
	loading.textContent = 'Loading...';
	loading.style.color = 'white';
	loading.style.fontSize = '2em';
	loading.style.animation = 'bounceText 3s linear infinite';
	loading.style.position = 'absolute';
	loading.style.left = '50%';
	loading.style.top = '50%';
	loading.style.transform = 'translate(-50%, -50%)';
	loading.style.animationDirection = 'alternate-reverse';

	if (!document.getElementById('bounceText')) {
		const style = document.createElement('style');
		style.id = 'bounceText';
		style.innerHTML = `
			@keyframes bounceText {
			0% { left: 85%; top: 70%; }
			50% { left: 18%; top: 50%; }
			100% { left: 85%; top: 30%; }
			}
		`;
		document.head.appendChild(style);
	}

	page.appendChild(loading);
	body.innerHTML = '';
	body.appendChild(page);
}

export function removeLoadingPage() {
	const	body = document.getElementById('body');
	const	page = document.getElementById('loadingpage');

	if (body && page)
		body.removeChild(page);
}