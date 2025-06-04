import Fastify from 'fastify'
import WebSocketServer from "ws";

const websock = new WebSocketServer({ port: 8080 });

let yLeft = 300;
let yRight = 300;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
	const data = JSON.parse(data.toString());

	if (data.key === "w")
		yLeft -= 10;
	else if (data.key === "s")
		yLeft += 10;
	else if (data.key === "arrowup")
		yRight -= 10;
	else if (data.key === "arrowdown")
		yRight += 10;

	yLeft = Math.max(0, Math.min(600, yLeft));
	yRight = Math.max(0, Math.min(600, yRight));

	websock.send(JSON.stringify({ yLeft, yRight }));
  });
});