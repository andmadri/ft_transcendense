import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { encryptSecret, decryptSecret } from '../utils/encryption.js';
import { verifyAuthCookie, verifyPendingTwofaCookie } from '../Auth/authToken.js';
import { signFastifyJWT } from "../utils/jwt.js";
import { getUserByID, updateUserInDB } from '../Database/users.js';
import { onUserLogin } from '../Services/sessionsService.js';
import { USERLOGIN_TIMEOUT } from '../structs.js';
import { db } from '../index.js';

function normalizeJSON(json) {
	if (typeof json === 'string') {
		JSON.parse(json);
		return json;
	}
	if (typeof json === 'object' && json !== null) {
		return JSON.stringify(json);
	}
	throw new Error('2FA secret must be a JSON string or object');
}

/**
 * Handles the Two-Factor Authentication (2FA) routes.
 * @param {Object} fastify - The Fastify instance.
 * @returns {Promise<void>} - Returns a promise that resolves when the routes are registered.
 * @description
 * This function registers the 2FA routes for generating, activating, disabling, and verifying 2FA.
 * The routes include:
 * - POST /api/2fa/generate: Generates a 2FA secret and QR code for the user.
 * - POST /api/2fa/activate: Activates 2FA for the user by verifying the provided token.
 * - POST /api/2fa/disable: Disables 2FA for the user by verifying the provided token.
 * - POST /api/2fa/verify: Verifies the provided token and logs in the user if successful.
 *  */
export default async function twoFactor(fastify) {
	fastify.post('/api/2fa/generate', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		if (!request || !request.user || !request.user.userId) {
			console.error(`Stopping generate 2FA, becasue can not find request or user`);
			return reply.status(404).send({ success: false, message: 'Invalid input - generate 2FA' });
		}
		try {
			const user = await getUserByID(db, request.user.userId);
			if (!user) {
				console.error('Stopping generate 2FA, becasue can not find user (invalid userId): ', request.user);
				return reply.status(404).send({ success: false, message: 'User not found' });
			}

			const secret = speakeasy.generateSecret({
				name: `Penguins (${user.email})`,
				length: 20
			});

			if (user.twofa_secret === 'google') {
				return reply.status(404).send({ success: false, message: '2FA not available for Google user.' });
			}
			// console.log(`user.twofa_secret: ${user.twofa_secret}`);
			// if (user.twofa_secret) {
			// 	console.log(`user.twofa_secret: ${user.twofa_secret}`);
			// 	const userSecret = JSON.parse(user.twofa_secret);
			// 	console.log(`userSecret: ${userSecret}`);

			// 	// IF THESE LOGS ABOVE ARE THE SAME THEN THIS STATEMENT CAN GO SEPERATE AND THE OTHER CODE CAN BE DELETED!
			// 	if (user.twofa_secret === 'google') {
			// 		console.log(`PLEASE DELETE SOME CODE HERE!! - Not this current ifstatement, but the nested ifstatement`);
			// 		return reply.status(404).send({ success: false, message: '2FA not available for Google user.' });
			// 	}


			// 	if (userSecret.google == "true") {
			// 		return reply.status(404).send({ success: false, message: '2FA not available for Google user.' });
			// 	}
			// }
			

			const encryptedSecret = encryptSecret(secret.base32);
			await updateUserInDB(db, { user_id: user.id, twofa_secret: normalizeJSON(encryptedSecret) });

			const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
			return reply.send({ qrCodeDataURL });
		} catch (err) {
			return reply.status(500).send({ success: false, message: 'Failed to generate 2FA secret' + `: ${err.message}` });
		}
	});

	fastify.post('/api/2fa/activate', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		if (!request || !request.user || !request.user.userId || !request.body) {
			console.error(`Stopping activate 2FA, becasue can not find request or user`);
			return reply.status(404).send({ success: false, message: 'Invalid input - activate 2FA' });
		}

		const { token } = request.body;
		let user = null;
		try {
			user = await getUserByID(db, request.user.userId);
			if (!user) {
				console.error('Stopping activate 2FA, becasue can not find user (invalid userId): ', request.user);
				return reply.status(404).send({ success: false, message: 'User not found' });
			}
		} catch (err) {
			return reply.status(404).send({ success: false, message: 'User not found' });
		}
		if (!user.twofa_secret) {
			console.error('Stopping activate 2FA, becasue can not find twofa_secret: ', request.user);
			return reply.status(404).send({ success: false, message: 'User have no 2FA secret' });
		}

		const userSecret = decryptSecret(JSON.parse(user.twofa_secret));
		if (!userSecret) {
			return reply.status(400).send({ success: false, message: '2FA secret not set' });
		}
		console.log(`user encyptedUserSecret: ${user.twofa_secret}\nuser userSecret: ${userSecret}`);

		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token,
			window: 1, // allow a little drift on the current timeslot
		});

		if (!verified) {
			return reply.status(401).send({ success: false, message: 'Invalid token' });
		}
		try {
			await updateUserInDB(db, { user_id: user.id, twofa_active: 1 });
		} catch (err) {
			console.log('Error updateUserInDB: ', err);
			return { success: false };
		}
		return { success: true };
	});

	fastify.post('/api/2fa/disable', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		if (!request || !request.user || !request.user.userId || !request.body || !request.body.token || !request.body.playerNr) {
			console.error(`Stopping disable 2FA, becasue can not find request, user or body`);
			return reply.status(404).send({ success: false, message: 'Invalid input - disable 2FA' });
		}

		const token = request.body.token;
		const playerNr = request.body.playerNr;
		let user = null;
		try {
			user = await getUserByID(db, request.user.userId);
			if (!user) {
				console.error('Stopping disable 2FA, becasue can not find user (invalid userId): ', request.user);
				return reply.status(404).send({ success: false, message: 'User not found' });
			}
		} catch (err) {
			return reply.status(404).send({ success: false, message: 'User not found' });
		}
		if (!user.twofa_secret) {
			console.error('Stopping disable 2FA, becasue can not find twofa_secret: ', request.user);
			return reply.status(404).send({ success: false, message: 'User have no 2FA secret' });
		}

		const userSecret = decryptSecret(JSON.parse(user.twofa_secret));
		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token,
			window: 1, // allow a little drift on the current timeslot
		});

		if (!verified) {
			return reply.status(401).send({ success: false, message: 'Invalid token' });
		}

		try {
			await updateUserInDB(db, { user_id: user.id, twofa_active: 0 });
		} catch (err) {
			console.log('Error updateUserInDB: ', err);
			return { success: false };
		}
		return { success: true, message: '2FA disabled successfully', playerNr: playerNr, userId: user.id };
	});

	fastify.post('/api/2fa/verify', {
		preHandler: verifyPendingTwofaCookie
	}, async (request, reply) => {
		if (!request || !request.body || !request.body.userId || !request.body.token || !request.body.playerNr) {
			console.error(`Stopping verify 2FA, becasue can not find request, user or body`);
			return reply.status(404).send({ success: false, message: 'Invalid input - verify 2FA' });
		}

		const token = request.body.token;
		const playerNr = request.body.playerNr;
		let user = null;
		try {
			user = await getUserByID(db, request.body.userId);
			if (!user) {
				console.error('Stopping verify 2FA, becasue can not find user (invalid userId): ', request.user);
				return reply.status(404).send({ success: false, message: 'User not found' });
			}
		} catch (err) {
			return reply.status(404).send({ success: false, message: 'User not found' });
		}
		
		const userSecret = decryptSecret(JSON.parse(user.twofa_secret));
		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token,
			window: 1, // allow a little drift on the current timeslot
		});
		if (!verified) {
			return reply.status(401).send({ success: false, message: 'Invalid token' });
		}
		try {
			await onUserLogin(db, user.id);
		} catch(err) {
			console.error(err.msg);
			return ({ error: 'Database error' });
		}

		reply.clearCookie('pendingTwofaToken' + playerNr, { path: '/' });
		const jwtToken = signFastifyJWT(user, fastify);
		reply.setCookie('jwtAuthToken' + playerNr, jwtToken, {
			httpOnly: true,      // Prevents JS access
			secure: true,        // Only sent over HTTPS
			sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
			signed: true,        // signed cookies
			encode: v => v,      // Use default encoding
			path: '/',
			maxAge: USERLOGIN_TIMEOUT
		}).send({ success: true, ok: true, message: 'User logged in successfully', playerNr: playerNr, userId: user.id, name: user.name, twofa: user.twofa_active });


		return { success: true };
	});
}

