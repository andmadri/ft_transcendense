// import Fastify from 'fastify'
// import WebSocketServer from "ws";

// const fastify = Fastify();
// const websock = new WebSocketServer({ port: 8080 });

// let yLeft = 300;
// let yRight = 300;


// fastify.listen({ port: 3000 }, (err, address) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
//   websock.on("connection", (ws) => {
// 	  ws.on("message", (input) => {
// 		const msg = JSON.parse(input.toString());

// 		if (msg.key === "w")
// 			yLeft -= 10;
// 		else if (msg.key === "s")
// 			yLeft += 10;
// 		else if (msg.key === "arrowup")
// 			yRight -= 10;
// 		else if (msg.key === "arrowdown")
// 			yRight += 10;

// 		yLeft = Math.max(0, Math.min(600, yLeft));
// 		yRight = Math.max(0, Math.min(600, yRight));

// 		websock.send(JSON.stringify({ yLeft, yRight }));
// 	  });
// 	});
//   console.log(`Fastify listening on ${address}`);
// });

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true })

fastify.register(fastifyStatic, {
	root: path.join(__dirname, "../build"),
	prefix: '/',
});

fastify.get('/', function (request, reply) {
	reply.send({hello: 'world'})
})

const websock = new WebSocketServer({ port: 8080 });

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	fastify.log.info('server listening on ${address}')
})