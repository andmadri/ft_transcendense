export function getLoadingPage() {
	if (document.getElementById('loadingpage'))
		return;

	const body = document.getElementById('body');
	if (!body)
		return ;
	body.innerHTML = '';

	const page = document.createElement('div');
	page.id = "loadingpage";
	page.className = "loadingpage";
	page.style.width = '100vw';
	page.style.height = '100vh';
	page.style.position = 'fixed';
	page.style.display = 'flex';
	page.style.justifyContent = 'center';
	page.style.alignItems = 'center';
	page.style.overflow = 'hidden';
	page.style.zIndex =  '9999';
	page.style.transition = 'opacity 200ms ease';
	page.style.opacity = '1';

	const innerBox = document.createElement('div');
	innerBox.style.position = 'relative';
	innerBox.style.width = '10rem';
	innerBox.style.height = '10rem';
	innerBox.style.display = 'flex';
	innerBox.style.alignItems = 'center';
	innerBox.style.justifyContent = 'center';
	innerBox.style.borderRadius = '12rem';
	innerBox.style.padding = '1rem';

	const wrapper = document.createElement('div');
	wrapper.className = 'wrapper_loadingpage';
	wrapper.style.position = 'absolute';
	wrapper.style.width = '8rem';
	wrapper.style.height = '8rem';
	wrapper.style.display = 'block';
	wrapper.style.transformOrigin = 'center center';
	wrapper.style.animation = 'circleball 2s linear infinite';
	wrapper.style.pointerEvents = 'none';
	

	const ball = document.createElement('div');
	ball.className = 'loading_ball';
	ball.style.position = 'absolute';
	ball.style.width = '1rem';
	ball.style.height = '1rem';
	ball.style.borderRadius= '50%';
	ball.style.border = '2px solid black'; 
	ball.style.background = 'white';
	ball.style.top = '50%';
	ball.style.left = '100%';
	ball.style.transform = 'translate(-50%, -50%) translateX(4rem)';

	const loadingTxt = document.createElement('div');
	loadingTxt.textContent = "Loading...";
	loadingTxt.style.position = 'absolute';
	loadingTxt.style.textAlign = 'center';
	loadingTxt.style.fontSize = '1.2rem';
	loadingTxt.style.fontWeight = 'bold';
	loadingTxt.style.color = 'black';
	innerBox.appendChild(loadingTxt);

	if (!document.getElementById('bounceText')) {
		const style = document.createElement('style');
		style.id = 'bounceText';
		style.innerHTML = `
			    @keyframes circleball {
     			from { transform: rotate(0deg); }
    			to   { transform: rotate(360deg); }
   				}`;
		document.head.appendChild(style);
	}
	wrapper.appendChild(ball);
	innerBox.append(loadingTxt, wrapper);
	page.appendChild(innerBox);
	body.appendChild(page);
}
