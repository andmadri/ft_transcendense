import Fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { handlePlayers } from './DBrequests/getPlayers.js';
import { handlePlayerInfo } from './DBrequests/getPlayerInfo.js';
import { handleDashboardMaking } from './DBrequests/getDashboardInfo.js';
import { handleFriends } from './DBrequests/getFriends.js';
import { createDatabase } from './Database/database.js'
import { handleGame } from './Game/game.js'
import { handleInitGame } from './InitGame/initGame.js'
import { handleMatchmaking } from './Pending/matchmaking.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';
import { addUserToRoom } from './rooms.js';
import { addUserSessionToDB } from './Database/sessions.js';
import  googleAuthRoutes  from './routes/googleAuth.js';
import  userAuthRoutes  from './routes/userAuth.js';
import  avatarRoutes  from './routes/avatar.js';
import  twoFactor  from './routes/twofa.js';

// FASTIFY => API SERVER
const fastify = Fastify({ logger: true });

// fastify-socket.io enables the use of Socket.io in a Fastify application.
fastify.register(fastifyIO, {
	preClose: (done) => {
		fastify.io.local.disconnectSockets(true);
		done();
	}
});

// change how you create database
export const db = await createDatabase();

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

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

// const httpServer = createServer(fastify.server);

fastify.ready().then(() => {
	fastify.io.on('connection', (socket) => {
	// console.log('🔌 A user connected:', socket.id);
	// Check if the request has a valid JWT token in cookies
	// const cookies = req.headers.cookie;
	const cookies = socket.handshake.headers.cookie || '';
	// console.log('Cookies from handshake:', cookies);
	const authTokens = parseAuthTokenFromCookies(cookies);
	// console.log('Auth tokens from cookies:', authTokens);

	let decoded;
	let userId1 = null;
	let userId2 = null;
	if (authTokens && authTokens.jwtAuthToken1) {
		// console.log('signed:', authTokens.jwtAuthToken1);
		const unsigned = fastify.unsignCookie(authTokens.jwtAuthToken1);
		// console.log('unsigned:', unsigned.value);
		// console.log('Unsigned JWT1:', unsigned);
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
	// console.log('User IDs from jwtCookie1:', userId1, 'jwtCookie2:', userId2);
	if (!userId1) {
		console.error('No valid auth tokens found in cookies');
		socket.emit('error', { action: 'error', reason: 'Unauthorized: No auth tokens found' });
		return ;
	}

		// add user to main room
		addUserToRoom(socket, 'main');

		// Socket that listens to incomming msg from frontend
		socket.on('message', (msg) => {
			const action = msg.action;
			if (!action) {
				socket.emit('error', { action: 'error', reason: 'No action specified' });
				return ;
			}
			// console.log(`Msg userID1 is now:", ${userId1} with action: ${action} and sub: ${msg.subaction}`);
			
			switch (action) {
				case 'playerInfo':
					return handlePlayerInfo(msg, socket, userId1, userId2);
				case 'matchmaking':
					return handleMatchmaking(db, msg, socket, userId1, fastify.io);
				case 'players':
					return handlePlayers(msg, socket, userId1);
				case 'friends':
					return handleFriends(msg, socket, userId1, fastify.io);
				case 'dashboard':
					return handleDashboardMaking(msg, socket, userId1);
				case 'init':
					return handleInitGame(db, msg, socket, userId1, userId2);
				case 'game':
					return handleGame(db, msg, socket, fastify.io);
				case 'error':
					console.log('Error from frontend..');
					return socket.emit('error', msg);
				default:
					return socket.emit('error', { reason: 'Unknown action' + action });
			}
		});

		socket.on('disconnect', () => {
			console.log(`User disconnected: ${userId1}`);
			try {
				// not sure if this is the good function but I want to remove
				// the player from the list
				addUserSessionToDB(db, {userId1, state: 'logout'});
			} catch (err) {
				console.error('Failed logout cleanup', err);
			}
		});
	});
});

try {
	await fastify.listen({ port: 3000, host: '0.0.0.0' });
	console.log('Server listening on port 3000');
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}