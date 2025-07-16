import * as dbFunctions from '../Database/database.js';
import { db } from '../index.js';
import bcrypt from 'bcrypt';
import { signFastifyJWT } from "../utils/jwt.js";

function sendBackFront(actionable, sub, socket, accessible, reasonMsg, user, player) {
	const msg = {
		action: actionable,
		subaction: sub,
		access: accessible,
		reason: reasonMsg
	}
	if (user) {
		msg.userId = user.id;
		msg.userName = user.name;
	}
	if (player) {
		msg.player = player;
	}
	socket.send(JSON.stringify(msg));
	return (true);
}

function checkName(name) {
	const nameRegex = /^[a-zA-Z0-9_-]+$/;
	if (!name.length)
		return ('Name can not be empty');
	else if (name.length > 30)
		return ('Name is too long');
	else if (!nameRegex.test(name))
		return ('Name has forbidden characters');
	return (null);
}

function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/;
	if (!email.length)
		return ('Email can not be empty');
	else if (email.length < 3)
		return ('Email is too short');
	else if (email.length > 254)
		return ('Email is too long');
	else if (!emailRegex.test(email))
		return ('Email has no @ and dot or forbidden characters');
	return (null);
}

function checkPassword(password) {
	const passwordRegex = /^\S+$/;
	if (!password.length)
		return ('Password can not be empty');
	else if (password.length < 8)
		return ('Password has less than 8 characters');
	else if (password.length > 64)
		return ('Password is too long');
	else if (!passwordRegex.test(password))
		return ('Password contains whitespace');
	return (null);
}

async function addUser(msg, socket) {
	let errorMsg;
	
	errorMsg = checkName(msg.name);
	if (errorMsg)
		return sendBackFront('login', 'signup', socket, 'no', errorMsg, '', '');
	errorMsg = checkEmail(msg.email);
	if (errorMsg)
		return sendBackFront('login', 'signup', socket, 'no', errorMsg, '', '');
	errorMsg = checkPassword(msg.password);
	if (errorMsg)
		return sendBackFront('login', 'signup', socket, 'no', errorMsg, '', '');
	try {
		const exists = await dbFunctions.userAlreadyExist(msg.email);
		if (exists)
			return sendBackFront('signup', socket, 'no', 'User allready exist', '', '');
		// Add avatar_url if provided, otherwise set to null
		if (!msg.avatar_url)
			msg.avatar_url = null;
		await dbFunctions.addUserToDB(msg);
		console.log('User: ', msg.name, ' is created');
		return sendBackFront('login', 'signup', socket, 'yes', 'User created', '', msg.playerLogin);
	}
	catch(err) {
		console.error('err' + err.msg);
		return sendBackFront('error', '', socket, 'no', 'Error while inserting new user', '', '');
	}
}

async function validateLogin(msg, socket, fastify) {
	let user;

	try {
		user = await dbFunctions.getUserByEmail(msg.email);
	}
	catch (err) {
		console.error('Error with getting user by email');
		return sendBackFront('login', 'login', socket, 'no', 'Error db', '', '');
	}
	if (!user || !user.password)
		return sendBackFront('login', 'login', socket, 'no', 'User not found', '', '');

	const isValidPassword = await bcrypt.compare(msg.password, user.password);
	if (!isValidPassword)
		return sendBackFront('login', 'login', socket, 'no', 'Incorrect password', '', '');

	try {
		const online = await dbFunctions.isOnline(msg.email, (online));
		await dbFunctions.updateOnlineStatus(msg.email, !online);
	}
	catch(err) {
		console.error(err.msg);
		// failed?
	}
	const jwtToken = signFastifyJWT(user, fastify);
	console.log('Generated JWT:', jwtToken);
	// socket.setCookie('jwtAuthToken', jwtToken, {
	// 	httpOnly: true,      // Prevents JS access
	// 	secure: true,        // Only sent over HTTPS
	// 	sameSite: 'Lax',     // CSRF protection ('Strict' is even more secure)
	// 	path: '/',
	// 	maxAge: 60 * 60      // 1 hour
	// })
	return sendBackFront('login', 'login', socket, 'yes', jwtToken, user, msg.player)
}

async function logoutPlayer(msg, socket) {
	try {
		console.log("want to log out: " + msg.id);
		if (msg.id == 0)
			return ;
		dbFunctions.updateOnlineStatus(msg.id, false);
		return sendBackFront('login', 'logout', socket, 'yes', 'Logout successfull', '', '');
	}
	catch(err) {
		console.log('Error logout player: ' + err.msg);
	}
}

export async function handleUserAuth(msg, socket, fastify) {
	if (!msg.subaction) {
		return sendBackFront('error', '', socket, 'no', `No subaction for ${msg.action}`, '', '');
	}

	switch (msg.subaction) {
		case 'signupUser':
			return addUser(msg, socket);
		case 'loginUser':
			return validateLogin(msg, socket, fastify);
		case 'logout':
			return logoutPlayer(msg, socket);
		default:
			return sendBackFront('error', '', socket, 'no', `Unkown subaction ${msg.subaction}`, '', '');
	}
}


