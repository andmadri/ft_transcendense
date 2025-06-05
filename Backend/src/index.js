// import Fastify from 'fastify';
// // import WebSocketServer from 'ws';

// const fastify = Fastify();
// // const wws = new WebSocketServer({ port: 8080 });

// let yLeft = 300;
// let yRight = 300;

// // wss.on("connection", (ws) => {
// //   ws.on("message", (data) => {
// // 	const msg = JSON.parse(data.toString());

// // 	if (msg.key === "w")
// // 	  yLeft -= 10;
// // 	else if (msg.key === "s")
// // 	  yLeft += 10;
// // 	else if (msg.key === "arrowup")
// // 	  yRight -= 10;
// // 	else if (msg.key === "arrowdown")
// // 	  yRight += 10;

// // 	yLeft = Math.max(0, Math.min(600, yLeft));
// // 	yRight = Math.max(0, Math.min(600, yRight));

// // 	ws.send(JSON.stringify({ yLeft, yRight }));
// //   });
// // });

// const start = async () => {
//   try {
// 	const address = await fastify.listen({ port: 8080 });
// 	console.log(`Fastify listening on ${address}`);
//   } catch (err) {
// 	console.error(err);
// 	process.exit(1);
//   }
// };

// console.log("WebSocket server is running on port 8080");
// while (true) {

// }

// src/index.js
import { WebSocketServer } from 'ws';  // let op: import via ESM (package.json moet "type":"module" hebben)

const PORT = 3000;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', socket => {
  console.log('🟢 Client verbonden via WebSocket');

  // Als client iets stuurt:
  socket.on('message', (data) => {
    console.log('Ontvangen van client:', data.toString());

    // Bijvoorbeeld: echo terug (of verwerk en stuur een ander object)
    const ontvangen = JSON.parse(data.toString());
    // Stel, ontvangen is { key: 'w' } of iets dergelijks:
    // Verwerk hier je game‐logica, bereken nieuwe posities, enz.
    const antwoord = {
      yLeft: Math.floor(Math.random() * 500),
      yRight: Math.floor(Math.random() * 500)
    };

    // Stuur JSON terug naar diezelfde socket:
    socket.send(JSON.stringify(antwoord));
  });

  socket.on('close', () => {
    console.log('🔴 Client heeft verbinding gesloten');
  });
});

wss.on('listening', () => {
  console.log(`WebSocket-server draait op ws://localhost:${PORT}`);
});