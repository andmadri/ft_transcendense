import axios from 'axios';
import { signFastifyJWT } from "../utils/jwt.js";
import bcrypt from 'bcrypt';
import { db } from '../index.js';
import { addUserToDB, getUserByEmail, updateUserInDB } from '../Database/users.js';
import { onUserLogin } from '../Services/sessionsService.js';
import { USERLOGIN_TIMEOUT } from '../structs.js';
import { getOnlineUsers } from '../Database/users.js';

/**
 * Handles the Google authentication process.
 * @param {Object} user - The user object returned from Google.
 * @returns {Promise<Object|null>} - Returns the user object from the database or null if
 * authentication fails.
 * @throws {Error} - Throws an error if the authentication process fails.
 * @description
 * This function checks if the user exists in the database. If the user exists, it verifies the password.
 * If the password is valid, it updates the user's information if necessary.
 * If the user does not exist, it creates a new user in the database.
 * Finally, it returns the user object from the database.
 */
async function handleGoogleAuth(user) {
	try {
		if (!user || !user.email) {
			console.error('INVALID_USER_DATA', 'Invalid user data received from Google', 'handleGoogleLogin');
			return null;
		}
		const exists = await getUserByEmail(db, user.email);
		if (exists) {
			console.log('User: ', user.name, ' already exists');
			const isValidPassword = await bcrypt.compare(user.id, exists.password);
			if (!isValidPassword) {
				console.warn('INVALID_GOOGLE_ID', `User: ${user.name} has invalid Google ID`, 'handleGoogleLogin');
				return null;
			}
			if (exists.name !== user.name || exists.avatar_url !== user.picture) {
				exists.user_id = user.id;
				exists.name = user.name.trim().slice(0, 10);
				exists.email = user.email.toLowerCase().trim();
				exists.avatar_url = user.picture;
				await updateUserInDB(db, exists);
			}
		} else {
			await addUserToDB(db, {
				email: user.email.toLowerCase().trim(),
				name: user.name.trim().slice(0, 10),
				password: user.id,
				avatar_url: user.picture
			});
			const newUser = await getUserByEmail(db, user.email);
			if (!newUser) {
				console.error('USER_CREATION_FAILED', `Failed to create user: ${user.name}`, 'handleGoogleLogin');
				return null;
			}
			await updateUserInDB(db, { 
				user_id: newUser.id, 
				twofa_active: 0,
				twofa_secret: 'google'
			});
		}
		return await getUserByEmail(db, user.email);
	} catch (err) {
		console.error('GOOGLE_AUTH_ERROR', err.message || err, 'handleGoogleLogin');
		return null;
	}
}

/**
 * Sets up the Google authentication routes for Fastify.
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} opts - Options for the Fastify plugin.
 * @returns {Promise<void>}
 * @description
 * This function defines two routes:
 * 1. `/api/auth/google`: Redirects the user to Google's OAuth2 authorization page.
 * 2. `/api/auth/google/callback`: Handles the callback from Google after the user
 * has authenticated. It exchanges the authorization code for an access token,
 * retrieves the user's profile information, and processes the user data.
 * If the user is successfully authenticated, it generates a JWT token and sets it as a cookie.
 * If any error occurs during the process, it logs the error and sends a 500 response.
 * This function is intended to be used as a Fastify plugin.
 * 	@throws {Error} - Throws an error if the authentication process fails.
 */
export default async function googleAuthRoutes(fastify) {
	fastify.get('/api/auth/google', async (request, reply) => {
		const playerNr = request.query.state || '1';
		const redirectUri = "https://" + process.env.HOST_DOMAIN + process.env.GOOGLE_REDIRECT_PATH;
		console.log('Redirect URI:', redirectUri);
		const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';
		const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
		const playerNrEncoded = encodeURIComponent(playerNr);
		const redirectURL = `${baseURL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${playerNrEncoded}`;
		reply.redirect(redirectURL);
	});

	fastify.get('/api/auth/google/callback', async (request, reply) => {
		const { code, state } = request.query;
		const playerNr = state || '1';
		const redirectUri = "https://" + process.env.HOST_DOMAIN + process.env.GOOGLE_REDIRECT_PATH;
		try {
			const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
				code,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code'
			});

			if (!tokenRes || !tokenRes.data || !tokenRes.data.access_token) {
				console.error('GOOGLE_AUTH_ERROR', 'Invalid token response from Google', 'googleAuthRoutes');
				return reply.code(500).send('OAuth login failed: Invalid token from Google.');
			}

			const { access_token } = tokenRes.data;

			const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: { Authorization: `Bearer ${access_token}` }
			});
			if (!userRes || !userRes.data || !userRes.data.email) {
				console.error('INVALID_GOOGLE_USER_DATA', 'Invalid user data received from Google', 'googleAuthRoutes');
				return reply.code(500).send('OAuth login failed: Invalid user data from Google.');
			}

			const user = await handleGoogleAuth(userRes.data);
			if (!user) {
				console.error('user returned:', user);
				return reply.code(500).send('User already exists - please log in with your username and password.');
			} else if (user) {
				try {
					const onlineUsers = await getOnlineUsers(db);
					if (onlineUsers.find(u => u.id === user.id)) {
						console.error('USER_ALREADY_LOGGED_IN', `User: ${user.name} is already logged in`, 'googleAuthRoutes');
						return reply.code(500).send('User is already logged in.');
					}
				} catch (err) {
					console.error('FETCH_ONLINE_USERS_ERROR', err.message || err, 'googleAuthRoutes');
					return reply.code(500).send('OAuth login failed: Database error');
				}
			}

			try {
				await onUserLogin(db, user.id);
			} catch(err) {
				console.error('USER_LOGIN_ERROR', err.message || err, 'googleAuthRoutes');
				return ({ error: 'Database error' });
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
			}).redirect(`https://${process.env.HOST_DOMAIN}`);
		} catch (err) {
			fastify.log.error(err.response?.data || err.message || err);
			reply.code(500).send('OAuth login failed.');
		}
	});
}
