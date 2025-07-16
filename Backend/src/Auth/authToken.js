

/**
 * Parses the 'auth_token' value from a cookie header string.
 * @param {string} cookieHeader - The raw Cookie header from the request.
 * @returns {string|null} - The value of the 'auth_token' cookie, or null if not found.
 */
export function parseAuthTokenFromCookies(cookieHeader) {
	if (typeof cookieHeader !== 'string')
		return null;

	const cookies = cookieHeader.split(';');
	for (const cookie of cookies) {
		const [rawName, ...rawValueParts] = cookie.trim().split('=');
		if (rawName === 'jwtAuthToken') {
			return rawValueParts.join('=');
		}
	}

	return null;
}