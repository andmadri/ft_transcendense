
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
		expiresIn: '1h'
	});
}