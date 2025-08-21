import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { addUser2faSecretToDB, toggleUser2faDB, getUserSecretDB } from '../Services/twofa.js';
import { encryptSecret, decryptSecret } from '../utils/encryption.js';
import { verifyAuthCookie, verifyPendingTwofaCookie } from '../Auth/authToken.js';
import { signFastifyJWT } from "../utils/jwt.js";
import { getUserByID } from '../Database/users.js';
import { onUserLogin } from '../Services/sessionsService.js';

import { db } from '../index.js' // DELETE THIS LATER
import { get } from 'http';

/**
 * Handles the Two-Factor Authentication (2FA) routes.
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} opts - Options for the Fastify plugin.
 * @returns {Promise<void>} - Returns a promise that resolves when the routes are registered.
 * @description
 * This function registers the 2FA routes for generating, activating, disabling, and verifying 2FA.
 * The routes include:
 * - POST /api/2fa/generate: Generates a 2FA secret and QR code for the user.
 * - POST /api/2fa/activate: Activates 2FA for the user by verifying the provided token.
 * - POST /api/2fa/disable: Disables 2FA for the user by verifying the provided token.
 * - POST /api/2fa/verify: Verifies the provided token and logs in the user if successful.
 *  */
export default async function twoFactor(fastify, opts) {
	fastify.post('/api/2fa/generate', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		console.log('Generating 2FA secret for user:', request.user);
		const userId = request.user.userId;
		console.log(`Generating 2FA secret for user ID: ${userId}`);
		try {
			const secret = speakeasy.generateSecret({
				name: `Penguins (${request.user.email})`,
				length: 20,
			});

			const userSecretStr = await getUserSecretDB(db, userId);
			if (userSecretStr) {
				const userSecret = JSON.parse(userSecretStr);
				console.log(`User secret: ${userSecret}`);
				if (userSecret.google == "true") {
					return reply.status(404).send({ success: false, message: '2FA not available for Google user.' });
				}
			}

			const encryptedSecret = encryptSecret(secret.base32);
			await addUser2faSecretToDB(db, userId, encryptedSecret);

			const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
			console.log(`2FA secret generated for user ${userId}: qrCodeDataURL=${qrCodeDataURL}`);
			return reply.send({ qrCodeDataURL });
		} catch (err) {
			return reply.status(500).send({ success: false, message: 'Failed to generate 2FA secret' + `: ${err.message}` });
		}
	});

	fastify.post('/api/2fa/activate', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		const { token } = request.body;
		const userId = request.user.userId;

		const encyptedUserSecret = await getUserSecretDB(db, userId);
		console.log(`user encyptedUserSecret: ${encyptedUserSecret}`);
		const userSecret = decryptSecret(JSON.parse(encyptedUserSecret));
		console.log(`user userSecret: ${userSecret}`);

		if (!userSecret) {
			return reply.status(400).send({ success: false, message: '2FA secret not set' });
		}

		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token,
			window: 1, // allow a little drift on the current timeslot
		});

		if (!verified) {
			return reply.status(401).send({ success: false, message: 'Invalid token' });
		}

		await toggleUser2faDB(db, userId, true);

		return { success: true };
	});

	fastify.post('/api/2fa/disable', {
		preHandler: verifyAuthCookie
	}, async (request, reply) => {
		const token = request.body.token;
		const userId = request.user.userId;
		const playerNr = request.body.playerNr;

		const encyptedUserSecret = await getUserSecretDB(db, userId);
		const userSecret = decryptSecret(JSON.parse(encyptedUserSecret));

		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token,
			window: 1, // allow a little drift on the current timeslot
		});

		if (!verified) {
			return reply.status(401).send({ success: false, message: 'Invalid token' });
		}

		await toggleUser2faDB(db, userId, false);

		return { success: true, message: '2FA disabled successfully', playerNr: playerNr, userId: userId };
	});

	fastify.post('/api/2fa/verify', {
		preHandler: verifyPendingTwofaCookie
	}, async (request, reply) => {
		const token = request.body.token;
		const userId = request.body.userId;
		const playerNr = request.body.playerNr;

		const encyptedUserSecret = await getUserSecretDB(db, userId);
		const userSecret = decryptSecret(JSON.parse(encyptedUserSecret));

		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token,
			window: 1,          // allow a little drift on the current timeslot
		});

		if (!verified) {
			return reply.status(401).send({ success: false, message: 'Invalid token' });
		}

		const user = await getUserByID(db, userId);
		if (!user) {
			return reply.status(404).send({ success: false, message: 'User not found' });
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
			maxAge: 60 * 60      // 1 hour
		}).send({ success: true, ok: true, message: 'User logged in successfully', playerNr: playerNr, userId: userId, name: user.name, twofa: user.twofa_active });


		return { success: true };
	});
}

