import axios from 'axios';
import { signFastifyJWT, signFastifyPendingTwofa } from "../utils/jwt.js";
import * as userDB from '../Database/users.js';
import bcrypt from 'bcrypt';
import { db } from '../index.js'

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
			console.log('Invalid user data from Google!');
			return null;
		}

		const exists = await userDB.getUserByEmail(db, user.email);
		if (exists) {
			console.log('User: ', user.name, ' already exists');
			const isValidPassword = await bcrypt.compare(user.id, exists.password);
			if (!isValidPassword) {
				console.log('User: ', user.name, ' Invalid google ID!');
				return null;
			}
			if (exists.name !== user.name || exists.avatar_url !== user.picture) {
				console.log('Updating user: ', user.name, ' in DB!');
				await userDB.updateUserInDB(db, {
					name: user.name,
					avatar_url: user.picture,
				});
			}
			const dbUserObj = await userDB.getUserByEmail(user.email);
			return dbUserObj;
		} else {
			await userDB.addUserToDB(db, {
				email: user.email,
				name: user.name,
				password: user.id,
				avatar_url: user.picture
			});
			console.log('User: ', user.name, ' is created');
			const dbUserObj = await userDB.getUserByEmail(db, user.email);
			return dbUserObj;
		}
	} catch (err) {
		console.error('Error during Google authentication:', err);
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
export default async function googleAuthRoutes(fastify, opts) {
	fastify.get('/api/auth/google', async (request, reply) => {
		const playerNr = request.query.playerNr || '1';

		const redirectUri = "https://" + process.env.HOST_DOMAIN + process.env.GOOGLE_REDIRECT_PATH;
		// console.log('Redirect URI:', redirectUri);
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
		// console.log('playerNr:', playerNr);
		// console.log('Redirect URI:', redirectUri);
		try {
			const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code'
			});

			if (!tokenRes || !tokenRes.data || !tokenRes.data.access_token) {
				console.log('Invalid token response from Google!');
				reply.code(500).send('OAuth login failed.');
				return;
			}

			const { access_token } = tokenRes.data;

			const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: { Authorization: `Bearer ${access_token}` }
			});
			if (!userRes || !userRes.data || !userRes.data.email) {
				console.log('Invalid user data from Google!');
				reply.code(500).send('OAuth login failed.');
				return;
			}

			const dbUserObj = await handleGoogleAuth(userRes.data);
			if (!dbUserObj) {
				console.log('dbUserObj returned:', dbUserObj);
				reply.code(500).send('OAuth login failed.');
				return;
			}

			const jwtToken = signFastifyJWT(dbUserObj, fastify);
			reply.setCookie('jwtAuthToken' + playerNr, jwtToken, {
				httpOnly: true,      // Prevents JS access
				secure: true,        // Only sent over HTTPS
				sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
				signed: true,        // signed cookies
				encode: v => v,      // Use default encoding
				path: '/',
				maxAge: 60 * 60      // 1 hour
			}).redirect(`https://${process.env.HOST_DOMAIN}:8443`);

		} catch (err) {
			fastify.log.error(err.response?.data || err.message);
			reply.code(500).send('OAuth login failed.');
		}
	});
}
