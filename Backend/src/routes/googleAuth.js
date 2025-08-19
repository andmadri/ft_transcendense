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
		console.log(user);
		if (!user || !user.email) {
			console.log('Invalid user data from Google!');
			return null;
		}

		const exists = await userDB.getUserByEmail(db, user.email);
		if (exists) {
			const isValidPassword = await bcrypt.compare(user.id, exists.password);
			if (!isValidPassword) {
				console.log('User: ', user.name, ' Invalid google ID!');
				return null;
			}
			// User already exists, update their information if necessary
			else if (exists.name !== user.name || exists.avatar_url !== user.picture) {
				console.log('Updating user: ', user.name, ' in DB!');
				// await userDB.updateUser({
				// 	name: user.name,
				// 	avatar_url: user.picture
				// });
			}
			console.log('User: ', user.name, ' already exists');
			const dbUserObj = await userDB.getUserByEmail(user.email);
			return dbUserObj;
		} else {
			await userDB.addUserToDB({
				email: user.email,
				name: user.name,
				password: user.id,
				avatar_url: user.picture
			});
			console.log('User: ', user.name, ' is created');
			const dbUserObj = await userDB.getUserByEmail(user.email);
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
		console.log('1backend: Google OAuth for playerNr:', playerNr);
		if ( playerNr == 'undefined' )
			playerNr = '1';


		const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';
		const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
		const playerNrEncoded = encodeURIComponent(playerNr);
		console.log('2backend: Google OAuth for playerNr:', playerNr);

		const redirectURL = `${baseURL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${playerNrEncoded}`;
		reply.redirect(redirectURL);
	});

	fastify.get('/api/auth/google/callback', async (request, reply) => {
		const { code, state } = request.query;
		const playerNr = state || '1';
		console.log('callback: Google OAuth for playerNr:', playerNr);

		try {
			const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: process.env.GOOGLE_REDIRECT_URI,
			grant_type: 'authorization_code'
			});

			const { access_token } = tokenRes.data;

			const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: { Authorization: `Bearer ${access_token}` }
			});

			const dbUserObj = await handleGoogleAuth(userRes.data);
			if (!dbUserObj) {
				console.log('dbUserObj returned null:', dbUserObj);
			}
			console.log('Google user data:', dbUserObj);

			if (dbUserObj.twofa_active) {
				const pendingTwofaToken = signFastifyPendingTwofa(dbUserObj, fastify);
				reply.setCookie('pendingTwofaToken' + playerNr, pendingTwofaToken, {
					httpOnly: true,      // Prevents JS access
					secure: true,        // Only sent over HTTPS
					sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
					signed: true,        // signed cookies
					path: '/',
					maxAge: 60 * 10      // 10 minutes
				}).redirect(`https://${window.location.hostname}:8443`);
			} else {
				const jwtToken = signFastifyJWT(dbUserObj, fastify);
				reply.setCookie('jwtAuthToken' + playerNr, jwtToken, {
					httpOnly: true,      // Prevents JS access
					secure: true,        // Only sent over HTTPS
					sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
					signed: true,        // signed cookies
					path: '/',
					maxAge: 60 * 60      // 1 hour
				}).redirect(`https://${window.location.hostname}:8443`);
			}
		} catch (err) {
			fastify.log.error(err.response?.data || err.message);
			reply.code(500).send('OAuth login failed.');
		}
	});
}
