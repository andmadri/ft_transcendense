import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { handleUserAuth } from './userAuth.js';
import { createDatabase } from './database.js'

const fastify = Fastify();
await fastify.register(websocket);
//change how you create database
export const db = createDatabase();

fastify.get('/ws', { websocket: true }, (connection, req) => {

	connection.socket.on('message', (message) => {
		const msg = JSON.parse(message.toString());
		const action = msg.action;
		// console.log('Received from frontend: ' + message);
		if (!action) {
			const returnMsg = { action: "Error" }
			connection.socket.send(JSON.stringify(returnMsg));
			return ;
		}

		// ADD HERE FUNCTIONS THAT MATCH WITH THE RIGHT ACTION
		if (action == 'loginUser' || action == 'signUpUser')
			return handleUserAuth(msg, connection.socket);
		else // send now same message back
			connection.socket.send(JSON.stringify(msg));
	});
});

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });

