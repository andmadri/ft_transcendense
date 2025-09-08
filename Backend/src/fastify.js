import Fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';

import userAuthRoutes from './routes/userAuth.js';
import twoFactor from './routes/twofa.js';
import googleAuthRoutes from './routes/googleAuth.js';
import avatarRoutes from './routes/avatar.js';
import chartRoutes from './routes/charts.js';

import fs from 'fs';
import path from 'path';

export async function initFastify() {
	// FASTIFY => API SERVER
	// const fastify = Fastify({ logger: true });
	const fastify = Fastify({ level: 'error' });

	// fastify-socket.io enables the use of Socket.io in a Fastify application.
	fastify.register(fastifyIO, {
		preClose: (done) => {
			fastify.io.local.disconnectSockets(true);
			done();
		}
	});
	
	
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
	
	// ADDED FOR CREATING IMAGE IN THE BACKEND - these 6 lines
	try {
		fs.mkdirSync(path.join(process.env.UPLOADS_DIR, 'charts'), { recursive: true });
	} catch (e) {
		console.error('[BOOT] Cannot create uploads dir:', UPLOADS_BASE, e);
	}
	await fastify.register(chartRoutes);
	
	fastify.setNotFoundHandler(function (request, reply) {
		reply.status(404).send({ error: 'Not Found' });
	});

	return fastify;
}
