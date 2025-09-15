import { USERLOGIN_TIMEOUT } from '../structs.js';

/**
 * Utility function to sign a JWT token using Fastify's JWT plugin.
 * @param {Object} user - The user object containing user details.
 * @param {Object} fastify - The Fastify instance with JWT plugin registered.
 * @return {string} - The signed JWT token.
 */
export function signFastifyJWT(user, fastify) {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET env var is missing');
	}

	const payload = {
		userId: user.id,
		email: user.email
	};

	return fastify.jwt.sign(payload, {
		algorithm: 'HS256',
		expiresIn: `${USERLOGIN_TIMEOUT}s`
	});
}

/**
 * Utility function to sign a pending 2FA token using Fastify's JWT plugin.
 * @param {Object} user - The user object containing user details.
 * @param {Object} fastify - The Fastify instance with JWT plugin registered.
 * @return {string} - The signed pending 2FA token.
 * @throws {Error} - Throws an error if the PENDING_TWOFA_SECRET environment variable is missing.
 * @description
 * This function creates a JWT token for pending 2FA authentication, which is used to verify the user's identity
 * before completing the 2FA setup.
 */
export function signFastifyPendingTwofa(user, fastify) {
	if (!process.env.PENDING_TWOFA_SECRET) {
		throw new Error('PENDING_TWOFA_SECRET env var is missing');
	}

	const payload = {
		userId: user.id,
		email: user.email,
		twofa: 'pending'
	};

	return fastify.jwt.sign(payload, {
		algorithm: 'HS256',
		expiresIn: '10m' 
	});
}