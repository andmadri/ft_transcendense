// gets element from html file
const logDiv = document.getElementById('log') as HTMLDivElement;
// const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;
// create a websocket
const socket = new WebSocket('ws://localhost:8080/ws');
// event listener when a websocket opens
socket.addEventListener('open', () => {
  log('✅ WebSocket is open');
});
// event listener for errors
socket.addEventListener('error', (err) => {
  log('⚠️ WebSocket error: ' + err);
});
// event listener that gets the meesage, put it in json format
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  const lPlayer = document.getElementById('lPlayer');
  const rPlayer = document.getElementById('rPlayer');
  if (lPlayer && rPlayer) {
    if (typeof data.lHeight === 'number') {
      lPlayer.style.top = `${data.lHeight}px`;
    }
    if (typeof data.rHeight === 'number') {
      rPlayer.style.top = `${data.rHeight}px`;
    }
	// log('Received from server: ' + JSON.stringify(data));
  }
});
// eventlistener when de websocket closes
socket.addEventListener('close', event => {
  console.log('WebSocket closes:', event.code, event.reason);
});

// print msg in element 
function log(msg: string) {
  const p = document.createElement('p');
  p.textContent = msg;
  logDiv.appendChild(p);
  console.log(msg);
}

window.addEventListener("keydown", (e: KeyboardEvent) => {
	if (socket.readyState === WebSocket.OPEN &&
		(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s")) {
		const lP = document.getElementById("lPlayer");
		const rP = document.getElementById("rPlayer");
		if (lP && rP) {
		const msg = { key: e.key, press: "keydown", lHeight: lP.offsetTop, rHeight: rP.offsetTop};
		socket.send(JSON.stringify(msg));
		} else {
			console.log("No lP ot rP");
		}
  }
});

function drawBall() {
	const ball = document.getElementById("ball");
	
}

// window.addEventListener("keyup", (e: KeyboardEvent) => {
// 	if (socket.readyState === WebSocket.OPEN &&
// 		(e.key === "arrowup" || e.key === "arrowdown" || e.key === "w" || e.key === "s")) {
// 		const lP = document.getElementById("lPlayer");
// 		const rP = document.getElementById("rPlayer");
// 		console.log('lPlayer:', lP);
// 		console.log('rPlayer:', rP);
// 		if (lP && rP) {
// 		const msg = { key: e.key, press: "keyup", lHeight: lP.offsetHeight, rHeight: rP.offsetHeight};
// 		socket.send(JSON.stringify(msg));
// 		} else {
// 			console.log("No lP ot rP");
// 		}
//   }
// });

