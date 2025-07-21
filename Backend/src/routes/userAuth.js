import { updateOnlineStatus } from '../Database/user.js';
import { addUser, validateLogin } from '../Auth/userValidation.js';
import { parseAuthTokenFromCookies } from '../Auth/authToken.js';

/**
 * User authentication routes for signup, login, and logout.
 * @param {Object} fastify - The Fastify instance.
 * @returns {Promise<void>} - Returns a promise that resolves when the routes are registered.
 * @description
 * This module defines the user authentication routes for signing up, logging in, and logging out users
 * using Fastify. It includes functions to handle user registration, login validation, and logout operations.
 * It also utilizes JWT for secure authentication and cookie management for session handling.
 * It is designed to work with a database for user management and online status tracking.
 */
export default async function userAuthRoutes(fastify) {
	fastify.post('/api/signup', async (request, reply) => {
		const { playerNr, username, email, password } = request.body;
		const msg = {
			name: username,
			email: email,
			password: password,
			player: playerNr
		};
		const answer = await addUser(msg);
		if (answer.error) {
			reply.status(400).send({ success: false, message: answer.error });
			return;
		}
		reply.send({ success: true, ok: true, message: 'User created successfully' });
	});

	fastify.post('/api/login', async (request, reply) => {
		const { playerNr, email, password } = request.body;
		const msg = {
			email: email,
			password: password,
			player: playerNr
		};
		const answer = await validateLogin(msg, fastify);
		console.log('User logged in:', answer);
		if (answer.error) {
			reply.status(401).send({ success: false, message: answer.error });
			return;
		}
		reply.setCookie('jwtAuthToken' + playerNr, answer.token, {
			httpOnly: true,      // Prevents JS access
			secure: true,        // Only sent over HTTPS
			sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
			path: '/',
			maxAge: 60 * 60      // 1 hour
		}).send({ success: true, ok: true, message: 'User logged in successfully', player: answer.player, user: answer.user });
	});

	fastify.post('/api/logout', async (request, reply) => {
		const { playerNr } = request.body;
		console.log(`Logging out player ${playerNr}`);
		console.log('Request headers:', request.headers);
		const cookies = request.headers.cookie;
		if (!cookies) {
			reply.status(401).send({ error: 'Unauthorized: No cookies found' });
			return;
		}
		const authToken = parseAuthTokenFromCookies(cookies);
		try {
			const decoded = fastify.jwt.verify(authToken['jwtAuthToken' + playerNr]);
			const email = decoded.email;
			console.log(`User ${email} is logging out`);
			await updateOnlineStatus(email, false);
			console.log(`User Nr: ${playerNr} logged in as: ${email} logged out`);
			reply.clearCookie('jwtAuthToken' + playerNr, {
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
				path: '/',
			}).send({ message: 'Logged out', ok: true });
		} catch (err) {
			reply.code(401).send({ error: 'Unauthorized: Invalid or missing token' });
		}
	});
}