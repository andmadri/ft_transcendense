import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
// import fastifyCors from '@fastify/cors';
import { handleOnlinePlayers } from './DBrequests/getOnlinePlayers.js';
import { handlePlayerInfo } from './DBrequests/getPlayerInfo.js';
import { handleFriends } from './DBrequests/getFriends.js';
import { createDatabase } from './Database/database.js'
import { handleGame } from './Game/game.js'
import  googleAuthRoutes  from './routes/googleAuth.js';
import  userAuthRoutes  from './routes/userAuth.js';
import  avatarRoutes  from './routes/avatar.js';
import  twoFactor  from './routes/twofa.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';
// import { testDB }   from './testDB.js';
import { addUserToDB } from './Database/users.js';
import { onUserLogin } from './Services/sessionsService.js';

const fastify = Fastify();
await fastify.register(websocket);

// change how you create database
export const db = await createDatabase();


// creating a guest and AI user for testing purposes -> create a function for that later
const guest_id = await addUserToDB(db, {
	name: 'Guest',
	email: 'guest@guest.guest',
	password: 'secretguest',
	avatar_url: null
});
await onUserLogin(db, guest_id);

const ai_id = await addUserToDB(db, {
	name: 'AI',
	email: 'ai@ai.ai',
	password: 'secretai',
	avatar_url: null
});
await onUserLogin(db, ai_id);

// RUN THE TEST DATABASE FUNCTION (testDB.js)
// await testDB(db);

// Register the cookie plugin and set a secret for signed cookies
fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });
// Register the JWT plugin
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

// Register Multipart for handling file uploads
await fastify.register(fastifyMultipart, {
	limits: { fileSize: 5 * 1024 * 1024, } // 5MB file size limit
});

// Register the auth route plugins for HTTPS API Auth endpoints:
// POST /api/signup - Sign up a new user
// POST /api/login - Log in an existing user
// POST /api/logout - Log out a user
await fastify.register(userAuthRoutes);
// POST /2fa/generate - Generate a 2FA secret and QR code
// POST /2fa/activate - Activate 2FA for a user
// POST /2fa/disable - Disable 2FA for a user
// GET /2fa/status - Check if 2FA is enabled for a user
await fastify.register(twoFactor);
// GET /api/auth/google - Redirect to Google OAuth
// GET /api/auth/google/callback - Handle Google OAuth callback
await fastify.register(googleAuthRoutes);
// POST /api/upload-avatar
await fastify.register(avatarRoutes);

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
		const unsigned = fastify.unsignCookie(authTokens.jwtAuthToken1);
		if (unsigned.valid) {
			try {
				decoded = fastify.jwt.verify(unsigned.value);
				userId1 = decoded.userId;
				// Use userId or decoded as needed for player 1
			} catch (err) {
				console.error('JWT1 verification failed:', err);
			}
		} else {
			console.error('JWT1 verification failed: Invalid cookie');
		}
	}
	if (authTokens && authTokens.jwtAuthToken2) {
		const unsigned = fastify.unsignCookie(authTokens.jwtAuthToken2);
		if (unsigned.valid) {
			try {
				decoded = fastify.jwt.verify(unsigned.value);
				userId2 = decoded.userId;
				// Use userId or decoded as needed for player 2
			} catch (err) {
				console.error('JWT2 verification failed:', err);
			}
		} else {
			console.error('JWT2 verification failed: Invalid cookie');
		}
	}
	console.log('User IDs from jwtCookie1:', userId1, 'jwtCookie2:', userId2);
	if (!userId1) {
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

