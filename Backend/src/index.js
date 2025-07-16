import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { handleUserAuth } from './Auth/userAuth.js';
import { handleOnlinePlayers } from './DBrequests/getOnlinePlayers.js';
import { createDatabase } from './Database/database.js'
import { initGame, gameUpdate } from './Game/gameLogic.js';
import googleAuthRoutes from './routes/googleAuth.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';

const fastify = Fastify();
await fastify.register(websocket);
// Register the cookie plugin
fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });
// Register the JWT plugin
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });
// Register the auth route plugin
await fastify.register(googleAuthRoutes);

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

	// Check if the request has a valid JWT token in cookies
	const cookies = req.headers.cookie;
	const authToken = parseAuthTokenFromCookies(cookies);

	try {
		const decoded = fastify.jwt.verify(authToken);
		const userId = decoded.userId;

		// Store the user ID on the connection
		connection.user = { id: userId };
		console.log(`JWT verified for user ID: ${userId}`);
		console.log(`User ${decoded.email} connected via WebSocket`);
	} catch (err) {
		console.error('JWT verification failed:', err);
		// connection.socket.send(JSON.stringify(msg));
		// return;
	}


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
		switch (action) {
			case 'login':
				return handleUserAuth(msg, connection.socket, fastify);
			case 'playerInfo':
				break ;
			case 'online':
				return handleOnlinePlayers(msg, connection.socket);
			case 'friends':
				break ;
			case 'pending':
				break ;
			case 'game':
				if (msg.subaction == 'init')
					return initGame(msg, connection.socket);
				else
					return gameUpdate(msg, connection.socket);
			case 'error':
				console.log('Error from frontend..');
				connection.socket.send(JSON.stringify(msg));
				break ;
			default:
				console.log('No valid action: ' + action);
				connection.socket.send(JSON.stringify(msg));
				return ;
		}			
	});
});



// fastify.get('/api/protected', async (request, reply) => {
// 	try {
// 		const user = await request.jwtVerify(); 
// 		// Verifies JWT from Authorization header or cookie
// 		// Proceed with user info
// 		reply.send({ message: 'Protected data', user });
// 	} catch (err) {
// 		reply.code(401).send({ error: 'Unauthorized' });
// 	}
// });


fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });

