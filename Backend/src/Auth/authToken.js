/**
 * Parses the jwtAuthToken1 and jwtAuthToken2 values from a cookie header string.
 * @param {string} cookieHeader - The raw Cookie header from the request.
 * @returns {object|null} - An object with jwtAuthToken1 and/or jwtAuthToken2 if found, or null if neither is present.
 */
export function parseAuthTokenFromCookies(cookieHeader) {
	if (typeof cookieHeader !== 'string')
		return null;

	const tokens = {};
	const cookies = cookieHeader.split(';');
	for (const cookie of cookies) {
		const [rawName, ...rawValueParts] = cookie.trim().split('=');
		const value = rawValueParts.join('=');
		if (rawName === 'jwtAuthToken1') {
			tokens.jwtAuthToken1 = value;
		} else if (rawName === 'jwtAuthToken2') {
			tokens.jwtAuthToken2 = value;
		}
	}
	return Object.keys(tokens).length > 0 ? tokens : null;
}

/** * Verifies the JWT token from the request cookies.
 * @param {Object} request - The Fastify request object.
 * @param {Object} reply - The Fastify reply object.
 * @returns {Promise<void>} - Returns a promise that resolves when the token is verified.
 * @throws {Error} - Throws an error if the token is invalid or not present.
 * @description
 * This function checks the request cookies for a JWT token named 'jwtAuthToken1'.
 * If the token is found, it verifies the token using Fastify's JWT plugin.
 * If the token is valid, it attaches the decoded user information to the request object.
 * If the token is invalid or not present, it sends a 401 Unauthorized response.
 * It is designed to be used as a middleware in Fastify routes to ensure that the user is authenticated before accessing protected resources.
 */
export async function verifyAuthCookie(request, reply) {
	const fastify = request.server;
	const cookies = request.cookies;
	const token = cookies['jwtAuthToken1'];
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
		const decoded = await request.server.jwt.verify(unsigned.value);
		request.user = decoded;
	} catch (err) {
		reply.code(401).send({ error: 'Unauthorized: Invalid token' });
	}
}

/**
 * Verifies the pending 2FA token from the request cookies.
 * @param {*} request - The Fastify request object.
 * @param {*} reply - The Fastify reply object.
 * @returns {Promise<void>} - Returns a promise that resolves when the token is verified.
 */
export async function verifyPendingTwofaCookie(request, reply) {
	const fastify = request.server;
	const cookies = request.cookies;
	const userId = request.body.userId;
	const playerNr = request.body.playerNr;
	console.log('Verifying pending 2FA token for userId:', userId, 'playerNr:', playerNr);
	const token = cookies['pendingTwofaToken' + playerNr];
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
		const decoded = await request.server.jwt.verify(unsigned.value);
		if (decoded.userId !== userId) {
			reply.code(401).send({ error: 'Unauthorized: Invalid token for user' });
			return;
		}
		request.user = decoded;
	} catch (err) {
		reply.code(401).send({ error: 'Unauthorized: Invalid token' });
	}
}