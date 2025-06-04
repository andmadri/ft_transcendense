"use strict";
const socket = new WebSocket("ws://localhost:8080");
const left = document.getElementById("playerleft");
const right = document.getElementById("playerright");
if (!left || !right) {
    throw new Error("Error");
}
// Send key in JSON format to websocket
window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "arrowup" || key === "arrowdown") {
        socket.send(JSON.stringify({ key }));
    }
    else if (key === "w" || key === "s") {
        socket.send(JSON.stringify({ key }));
    }
});
// receive string message from websocket
socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    left.style.top = `${msg.yLeftPos}px`;
    right.style.top = `${msg.yRightPos}px`;
});
// MOVE TO BACKEND (REMOVE!)
// let yLeftPos = 300;
// let yRightPos = 300;
// window.addEventListener("keydown", (event: KeyboardEvent) => {
// 	const key = event.key.toLowerCase();
// 	if (key === "arrowup") {
// 		yRightPos -= 10;
// 	} else if (key === "arrowdown") {
// 		yRightPos += 10;
// 	} else if (key === "w") {
// 		yLeftPos -= 10;
// 	} else if (key === "s") {
// 		yLeftPos += 10;
// 	}
// 	if (yLeftPos < 0) 
// 		yLeftPos = 0;
// 	if (yLeftPos > 600) 
// 		yLeftPos = 600;
// 	if (yRightPos < 0) 
// 		yRightPos = 0;
// 	if (yRightPos > 600) 
// 		yRightPos = 600;
// 	left.style.top = `${yLeftPos}px`;
// 	right.style.top = `${yRightPos}px`;
// });
