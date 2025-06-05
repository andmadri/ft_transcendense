// const socket = new WebSocket("ws://localhost:8080");

// const left = document.getElementById("playerleft") as HTMLElement | null;
// const right = document.getElementById("playerright") as HTMLElement | null;

// if (!left || !right) {
// 	throw new Error("Error");
// }

// // Send key in JSON format to websocket
// window.addEventListener("keydown", (event: KeyboardEvent) => {
// 	const key = event.key.toLowerCase();

// 	if (key === "arrowup" || key === "arrowdown") {
// 		socket.send(JSON.stringify({ key }));
// 	} else if (key === "w" || key === "s") {
// 		socket.send(JSON.stringify({ key }));
// 	}
// })

// // receive string message from websocket
// socket.addEventListener("message", (event) => {
// 	const msg = JSON.parse(event.data);

// 	left.style.top = `${msg.yLeftPos}px`;
// 	right.style.top = `${msg.yRightPos}px`;

// });

// // MOVE TO BACKEND (REMOVE!)
// // let yLeftPos = 300;
// // let yRightPos = 300;

// // window.addEventListener("keydown", (event: KeyboardEvent) => {
// // 	const key = event.key.toLowerCase();

// // 	if (key === "arrowup") {
// // 		yRightPos -= 10;
// // 	} else if (key === "arrowdown") {
// // 		yRightPos += 10;
// // 	} else if (key === "w") {
// // 		yLeftPos -= 10;
// // 	} else if (key === "s") {
// // 		yLeftPos += 10;
// // 	}

// // 	if (yLeftPos < 0) 
// // 		yLeftPos = 0;
// // 	if (yLeftPos > 600) 
// // 		yLeftPos = 600;

// // 	if (yRightPos < 0) 
// // 		yRightPos = 0;
// // 	if (yRightPos > 600) 
// // 		yRightPos = 600;

// // 	left.style.top = `${yLeftPos}px`;
// // 	right.style.top = `${yRightPos}px`;
// // });



const logDiv = document.getElementById('log') as HTMLDivElement;
const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;

// Maak WebSocket‐verbinding aan
// Omdat we Nginx straks op poort 8080 publiceren, gebruiken we ws://localhost:8080/ws
const socket = new WebSocket('ws://localhost:8080/ws');

socket.addEventListener('open', () => {
  log('✅ WebSocket is open');
});

socket.addEventListener('error', (err) => {
  log('⚠️ WebSocket error: ' + err);
});

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  log('⬅️ Ontvangen van server: ' + JSON.stringify(data));
});

socket.addEventListener('close', () => {
  log('❌ WebSocket gesloten');
});

// Druk iets af in het log-vak op de pagina
function log(msg: string) {
  const p = document.createElement('p');
  p.textContent = msg;
  logDiv.appendChild(p);
  console.log(msg);
}

// Wanneer gebruikers op de knop klikken, stuur een JSON‐object
sendBtn.addEventListener('click', () => {
  if (socket.readyState === WebSocket.OPEN) {
    const bericht = { key: 'test', timestamp: Date.now() };
    socket.send(JSON.stringify(bericht));
    log('➡️ Verstuurt naar server: ' + JSON.stringify(bericht));
  } else {
    log('⏳ WebSocket nog niet open');
  }
});
