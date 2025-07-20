

// /**
//  * Parses the 'auth_token' value from a cookie header string.
//  * @param {string} cookieHeader - The raw Cookie header from the request.
//  * @returns {string|null} - The value of the 'auth_token' cookie, or null if not found.
//  */
// export function parseAuthTokenFromCookies(cookieHeader) {
// 	if (typeof cookieHeader !== 'string')
// 		return null;

// 	const cookies = cookieHeader.split(';');
// 	for (const cookie of cookies) {
// 		const [rawName, ...rawValueParts] = cookie.trim().split('=');
// 		if (rawName === 'jwtAuthToken1' || rawName === 'jwtAuthToken2') {
// 			return rawValueParts.join('=');
// 		}
// 	}

// 	return null;
// }

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

	// Return null if neither token is found
	return Object.keys(tokens).length > 0 ? tokens : null;
}