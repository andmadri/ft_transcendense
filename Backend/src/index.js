import Fastify from 'fastify'
import WebSocketServer from "ws";

const fastify = Fastify();
const websock = new WebSocketServer({ port: 8080 });

let yLeft = 300;
let yRight = 300;


fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  websock.on("connection", (ws) => {
	  ws.on("message", (input) => {
		const msg = JSON.parse(input.toString());

		if (msg.key === "w")
			yLeft -= 10;
		else if (msg.key === "s")
			yLeft += 10;
		else if (msg.key === "arrowup")
			yRight -= 10;
		else if (msg.key === "arrowdown")
			yRight += 10;

		yLeft = Math.max(0, Math.min(600, yLeft));
		yRight = Math.max(0, Math.min(600, yRight));

		websock.send(JSON.stringify({ yLeft, yRight }));
	  });
	});
  console.log(`Fastify listening on ${address}`);
});