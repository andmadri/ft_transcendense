import { addUser, validateLogin } from '../Auth/userValidation.js';
import { parseAuthTokenFromCookies } from '../Auth/authToken.js';
import { addUserSessionToDB } from '../Database/sessions.js';
import { getUserByID }        from '../Database/users.js';
import { signFastifyJWT, signFastifyPendingTwofa } from "../utils/jwt.js";
import { db } from '../index.js' // DELETE THIS LATER

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
		console.log('Login answer:', answer.user);
		if (answer.error) {
			reply.status(401).send({ success: false, message: answer.error });
			return;
		}
		if (answer.user.twofa_active) {
			const pendingTwofaToken = signFastifyPendingTwofa(answer.user, fastify);
			reply.setCookie('pendingTwofaToken' + playerNr, pendingTwofaToken, {
				httpOnly: true,      // Prevents JS access
				secure: true,        // Only sent over HTTPS
				sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
				signed: true,        // signed cookies
				encode: v => v,      // Use default encoding
				path: '/',
				maxAge: 60 * 10      // 10 minutes
			}).send({ success: true, ok: true, message: 'Two-factor authentication required', playerNr: playerNr, userId: answer.user.id, name: answer.user.name, twofaPending: true });
		} else {
			const jwtToken = signFastifyJWT(answer.user, fastify);
			console.log('JWT Token:', jwtToken);
			reply.setCookie('jwtAuthToken' + playerNr, jwtToken, {
				httpOnly: true,      // Prevents JS access
				secure: true,        // Only sent over HTTPS
				sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
				signed: true,        // signed cookies
				encode: v => v,      // Use default encoding
				path: '/',
				maxAge: 60 * 60      // 1 hour
			}).send({ success: true, ok: true, message: 'User logged in successfully', playerNr: answer.player, userId: answer.user.id, name: answer.user.name, twofa: answer.user.twofa_active });
		}
	});

	fastify.post('/api/logout', async (request, reply) => {
		const playerNr = request.body.playerNr;
		console.log(`Logging out player ${playerNr}`);
		const cookies = request.cookies;
		console.log('Cookies:', cookies);
		if (!cookies) {
			reply.status(401).send({ error: 'Unauthorized: No cookies found' });
			return;
		}
		const unsigned = fastify.unsignCookie(cookies['jwtAuthToken' + playerNr]);
		if (!unsigned.valid) {
			reply.code(401).send({ error: 'Unauthorized: Invalid token' });
			return;
		}
		try {
			// MAYBE CHANGE THIS LATER: Marty edited this, but is not sure if this is correct
			const decoded = fastify.jwt.verify(unsigned.value);
			const user = await getUserByID(db, decoded.userId);
			await addUserSessionToDB(db, {user_id: user.id, state: 'logout'});
			reply.clearCookie('jwtAuthToken' + playerNr, {
				httpOnly: true,
				secure: true,
				signed: true,
				encode: v => v,
				sameSite: 'Strict',
				path: '/',
			}).send({ message: 'Logged out', ok: true });
		} catch (err) {
			reply.code(401).send({ error: 'Unauthorized: Invalid or missing token' });
		}
	});
}