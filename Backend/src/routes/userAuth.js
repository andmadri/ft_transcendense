import { addUser, validateLogin } from '../Auth/userValidation.js';
import { onUserLogout } from '../Services/sessionsService.js';
import { getUserByID }        from '../Database/users.js';
import { signFastifyJWT, signFastifyPendingTwofa } from "../utils/jwt.js";
import { db } from '../index.js';
import { onUserLogin } from '../Services/sessionsService.js';
import { verifyAuthCookie } from '../Auth/authToken.js';
import { USERLOGIN_TIMEOUT } from '../structs.js';
import { tournament } from '../Tournament/tournament.js'

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
	fastify.post('/api/refresh-token', { preHandler: verifyAuthCookie }, async (request, reply) => {
		const playerNr = request.body.playerNr;
		// console.log('Refreshing token for playerNr: ', playerNr);
		if (playerNr === 2 ) {
			const cookies = request.cookies;
			const token = cookies['jwtAuthToken2'];
			if (!token) {
				reply.code(401).send({ error: 'Unauthorized: No token' });
				return;
			}
			const unsigned = fastify.unsignCookie(token);
			if (!unsigned.valid) {
				reply.code(401).send({ error: 'Unauthorized: Invalid token' });
				return;
			}
			try {
				const decoded = await fastify.jwt.verify(unsigned.value);
				request.user = decoded; // Attach user info to request if needed
			} catch (err) {
				reply.code(401).send({ error: 'Unauthorized: Invalid token' });
			}
		}

		const userId = request.user.userId;
		let user = null;
		try {
			user = await getUserByID(fastify.db || db, userId);
			if (!user) {
				return reply.status(401).send({ error: 'Unauthorized' });
			}
		} catch (err) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
		const jwtToken = signFastifyJWT(user, fastify);
		reply.setCookie('jwtAuthToken' + playerNr, jwtToken, {
			httpOnly: true,      // Prevents JS access
			secure: true,        // Only sent over HTTPS
			sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
			signed: true,        // signed cookies
			encode: v => v,      // Use default encoding
			path: '/',
			maxAge: USERLOGIN_TIMEOUT
		}).send({ success: true });
	});
	fastify.post('/api/playerInfo', async (request, reply) => {
		const cookies = request.cookies;
		const cookie = cookies['jwtAuthToken1'];
		if (!cookie) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
		const unsigned = fastify.unsignCookie(cookie);
		if (!unsigned.valid) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
		try {
			const decoded = fastify.jwt.verify(unsigned.value);
			const user = await getUserByID(fastify.db || db, decoded.userId);
			if (!user) {
				return reply.status(401).send({ error: 'Unauthorized' });
			}
			let inTournament = false;
			for (const player of tournament.players) {
				if (player.id == user.id) {
					inTournament = true;
					break ;
				}
			}
			reply.send({
				success: true,
				userId: user.id,
				name: user.name,
				email: user.email,
				twofa: user.twofa_active,
				inTournament
			});
		} catch (err) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
	});

	fastify.post('/api/signup', async (request, reply) => {
		const { playerNr, username, email, password } = request.body;
		const msg = {
			name: username.trim(),
			email: email.toLowerCase(),
			password: password,
			player: playerNr
		};
		const errorMsg = await addUser(msg);
		if (errorMsg) {
			reply.status(400).send({ success: false, message: errorMsg });
			return;
		}
		reply.send({ success: true, ok: true, message: 'User created successfully' });
	});

	fastify.post('/api/login', async (request, reply) => {
		const { playerNr, email, password } = request.body;
		const msg = {
			email: email.toLowerCase(),
			password: password,
			player: playerNr
		};
		const answer = await validateLogin(msg, fastify);
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
				maxAge: USERLOGIN_TIMEOUT
			}).send({ success: true, ok: true, message: 'Two-factor authentication required', playerNr: playerNr, userId: answer.user.id, name: answer.user.name, twofaPending: true });
		} else {

			try {
				await onUserLogin(db, answer.user.id);
			} catch(err) {
				console.error(err.msg);
			}

			const jwtToken = signFastifyJWT(answer.user, fastify);
			reply.setCookie('jwtAuthToken' + playerNr, jwtToken, {
				httpOnly: true,      // Prevents JS access
				secure: true,        // Only sent over HTTPS
				sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
				signed: true,        // signed cookies
				encode: v => v,      // Use default encoding
				path: '/',
				maxAge: USERLOGIN_TIMEOUT
			}).send({ success: true, ok: true, message: 'User logged in successfully', playerNr: answer.player, userId: answer.user.id, name: answer.user.name, twofa: answer.user.twofa_active });
		}
	});

	fastify.post('/api/logout', {
			preHandler: verifyAuthCookie
		}, async (request, reply) => {
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
			const decoded = fastify.jwt.verify(unsigned.value);
			const user = await getUserByID(db, decoded.userId);
			await onUserLogout(db, user.id);
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