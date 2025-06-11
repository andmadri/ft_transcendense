import Fastify from 'fastify';
import websocket from '@fastify/websocket';

const fastify = Fastify();
await fastify.register(websocket);


fastify.get('/ws', { websocket: true }, (connection /* SocketStream */, req) => {

  connection.socket.on('message', (message) => {
    const msg = JSON.parse(message.toString());

	// if (msg.key == "ArrowUp") {
	// 	msg.rHeight -= 10;
	// } else if (msg.key == "ArrowDown") {
	// 	msg.rHeight += 10;
	// } else if (msg.key == "w") {
	// 	msg.lHeight -= 10;
	// } else if (msg.key == "s") {
	// 	msg.lHeight += 10;
	// }
	// if (msg.rHeight < 0) 
	// 	msg.rHeight = 0;
	// if (msg.rHeight > 600) 
	// 	msg.rHeight = 600;

	// if (msg.lHeight < 0) 
	// 	msg.lHeight = 0;
	// if (msg.lHeight > 600) 
	// 	msg.lHeight = 600;
    connection.socket.send(JSON.stringify(msg));
  });
});

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });
