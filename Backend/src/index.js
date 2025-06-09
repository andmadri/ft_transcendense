import Fastify from 'fastify';
import websocket from '@fastify/websocket';

const fastify = Fastify();
await fastify.register(websocket);

fastify.get('/ws', { websocket: true }, (connection /* SocketStream */, req) => {
  connection.socket.on('message', (message) => {
    console.log('Ontvangen van client:', message.toString());

    // Stuur iets terug
    connection.socket.send(JSON.stringify({ antwoord: 'pong', ontvangen: message.toString() }));
  });
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`✅ Server draait op ${address}`);
});

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

// statische frontend files serveren
// fastify.register(import('@fastify/static'), {
//   root: path.join(__dirname, 'public'),
//   prefix: '/',
// });

fastify.listen({ port: 3000, host: '0.0.0.0' });
