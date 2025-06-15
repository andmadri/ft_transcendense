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
    console.log("This is the key pressed: ${key}");
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
