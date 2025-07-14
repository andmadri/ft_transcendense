import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { handleUserAuth } from './Auth/userAuth.js';
import { handleOnlinePlayers } from './DBrequests/getOnlinePlayers.js';
import { createDatabase } from './Database/database.js'
import { initGame, gameUpdate } from './Game/gameLogic.js';

const fastify = Fastify();
await fastify.register(websocket);
//change how you create database
export const db = await createDatabase();


/*
FROM frontend TO backend				
• login => loginUpser / signUpUser / logout				
• playerInfo => changeName / addAvatar / delAvatar		
• chat => outgoing										
• online => getOnlinePlayers / getOnlinePlayersWaiting	
• friends => getFriends / addFriend / deleteFriend		
• pending => addToWaitlist / acceptGame					
• game => init / ballUpdate / padelUpdate / scoreUpdate	
• error => crash		
*/

fastify.get('/wss', { websocket: true }, (connection, req) => {

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
		if (action == 'login')
			return handleUserAuth(msg, connection.socket);
		else if (action == 'online') 
			return handleOnlinePlayers(msg, connection.socket);
		else if (action == 'game' && msg.subaction == 'init')
			return initGame(msg, connection.socket);
		else if (action == 'game')
			return gameUpdate(msg, connection.socket);
		else // send now same message back
			connection.socket.send(JSON.stringify(msg));
	});
});

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });

