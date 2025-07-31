import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { handleOnlinePlayers } from './DBrequests/getOnlinePlayers.js';
import { handlePlayerInfo } from './DBrequests/getPlayerInfo.js';
import { handleFriends } from './DBrequests/getFriends.js';
import { createDatabase } from './Database/database.js'
import { handleGame } from './Game/game.js'
import  googleAuthRoutes  from './routes/googleAuth.js';
import  userAuthRoutes  from './routes/userAuth.js';
import  avatarRoutes  from './routes/avatar.js';
import { parseAuthTokenFromCookies } from './Auth/authToken.js';
import { getUserByID, updateOnlineStatus } from './Database/user.js';
import uploadAvatarRoute from './routes/avatar.js';
import { Server as SocketIOServer } from 'socket.io';
import { handlePending } from './Game/gameMatch.js';
import fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';

const fastify = Fastify();
const httpServer = createServer(fastify.server);

// change how you create database
export const db = await createDatabase();

fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

await fastify.register(googleAuthRoutes);
await fastify.register(userAuthRoutes);
await fastify.register(fastifyMultipart);
await fastify.register(uploadAvatarRoute);

fastify.setNotFoundHandler(function (request, reply) {
  reply.status(404).send({ error: 'Not Found' });
});

const start = async () => {
  try {
    await fastify.ready();
    httpServer.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

const io = new Server(httpServer, {
  path: '/socket.io/',
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
	console.log('🔌 A user connected:', socket.id);
	// Check if the request has a valid JWT token in cookies
	// const cookies = req.headers.cookie;
	const cookies = socket.handshake.headers.cookie || '';
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
	if (!userId1) {
		console.error('No valid auth tokens found in cookies');
		socket.emit('error', { reason: 'Unauthorized: No valid tokens' });
		// socket.disconnect();
		return ;
	}
	console.log('✅ Authenticated user(s):', userId1, userId2);

	socket.on('message', (messageStr) => {
		let msg;
		try {
			msg = typeof messageStr === 'string' ? JSON.parse(messageStr) : messageStr;
		} catch (err) {
			return socket.emit('error', { action: 'error', reason: 'Invalid JSON' });
		}
		const action = msg.action;
		if (!action) {
			socket.emit('error', { action: 'error', reason: 'No action specified' });
			return ;
		}

		// ADD HERE FUNCTIONS THAT MATCH WITH THE RIGHT ACTION
		switch (action) {
			case 'playerInfo':
				return handlePlayerInfo(msg, socket, userId1, userId2);
			case 'online':
				return handleOnlinePlayers(msg, socket);
			case 'friends':
				return handleFriends(msg, socket);
			case 'pending':
				handlePending(msg, socket)
				break ;
			case 'game':
				return handleGame(msg, socket, userId1, userId2);
			case 'error':
				console.log('Error from frontend..');
				return socket.emit('error', msg);
				break ;
			default:
				return socket.emit('error', { reason: 'Unknown action' + action });
				return ;
		}
	});

	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.id}`);
		try {
			const user = getUserByID(userId1);
			if (user?.email) updateOnlineStatus(user.email, 'offline');
		} catch (err) {
			console.error('Failed logout cleanup', err);
		}
	});
});
