import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyCors from '@fastify/cors';
import { handleOnlinePlayers } from './DBrequests/getOnlinePlayers.js';
import { handlePlayerInfo } from './DBrequests/getPlayerInfo.js';
import { handleFriends } from './DBrequests/getFriends.js';
import { createDatabase } from './Database/database.js'
import { handleGame } from './Game/game.js'
import  googleAuthRoutes  from './routes/googleAuth.js';
import  userAuthRoutes  from './routes/userAuth.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';
import { getUserByID, updateOnlineStatus } from './Database/user.js';
import uploadAvatarRoute from './routes/avatar.js';

const fastify = Fastify();
await fastify.register(websocket);

// change how you create database
export const db = await createDatabase();

// Register the cookie plugin
fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });

// Register the JWT plugin
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

// Register the auth route plugins for HTTPS API Auth endpoints:
// POST /api/signup - Sign up a new user
// POST /api/login - Log in an existing user
// POST /api/logout - Log out a user
// GET /api/auth/google - Redirect to Google OAuth
// GET /api/auth/google/callback - Handle Google OAuth callback
await fastify.register(googleAuthRoutes);
await fastify.register(userAuthRoutes);

// POST /api/upload-avatar
await fastify.register(fastifyMultipart);
await fastify.register(uploadAvatarRoute);

/*
FROM frontend TO backend
• login => loginUpser / signUpUser / logout
• playerInfo => changeName / addAvatar / delAvatar / getPlayerData
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
	const authTokens = parseAuthTokenFromCookies(cookies);

	let decoded;
	let userId1 = null;
	let userId2 = null;
	if (authTokens && authTokens.jwtAuthToken1) {
		try {
			decoded = fastify.jwt.verify(authTokens.jwtAuthToken1);
			userId1 = decoded.userId;
			// Use userId or decoded as needed for player 1
		} catch (err) {
			console.error('JWT1 verification failed:', err);
		}
	}
	if (authTokens && authTokens.jwtAuthToken2) {
		try {
			decoded = fastify.jwt.verify(authTokens.jwtAuthToken2);
			userId2 = decoded.userId;
			// Use userId or decoded as needed for player 2
		} catch (err) {
			console.error('JWT2 verification failed:', err);
		}
	}
	console.log('User IDs from jwtCookie1:', userId1, 'jwtCookie2:', userId2);
	if (!userId1 && !userId2) {
		console.error('No valid auth tokens found in cookies');
		connection.socket.send(JSON.stringify({ action: "error", reason: "Unauthorized: No auth tokens found" }));
		return ;
	}


	connection.socket.on('message', (message) => {
		const msg = JSON.parse(message.toString());
		console.log('Received from frontend:', JSON.stringify(msg));
		const action = msg.action;
		// console.log('Received from frontend: ' + message);
		if (!action) {
			const returnMsg = { action: "Error" }
			connection.socket.send(JSON.stringify(returnMsg));
			return ;
		}

		// ADD HERE FUNCTIONS THAT MATCH WITH THE RIGHT ACTION
		switch (action) {
			// case 'login':
			// 	return handleUserAuth(msg, connection.socket, fastify);
			case 'playerInfo':
				return handlePlayerInfo(msg, connection.socket, userId1, userId2);
			case 'online':
				return handleOnlinePlayers(msg, connection.socket);
			case 'friends':
				return handleFriends(msg, connection.socket);
			case 'pending':
				break ;
			case 'game':
				return handleGame(msg, connection.socket, userId1, userId2);
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

	connection.on('close', () => {
		(async () => {
			try {
				const user = getUserByID(userId1);
				if (user && user.email)
					updateOnlineStatus(user.email, 'offline');
			} catch (err) {
				console.error('Player can not logged out', err);
			}
		})
	});
});

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });

