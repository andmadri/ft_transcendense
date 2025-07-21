import { addUserToDB, updateOnlineStatus, isOnline, getUserByEmail, userAlreadyExist } from '../Database/user.js';
import bcrypt from 'bcrypt';
import { signFastifyJWT } from "../utils/jwt.js";

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

export async function addUser(msg) {
	let errorMsg;
	
	errorMsg = checkName(msg.name);
	if (errorMsg)
		return (errorMsg);
	errorMsg = checkEmail(msg.email);
	if (errorMsg)
		return (errorMsg);
	errorMsg = checkPassword(msg.password);
	if (errorMsg)
		return (errorMsg);
	try {
		const exists = await userAlreadyExist(msg.email);
		if (exists)
			return (exists);
		if (!msg.avatar_url)
			msg.avatar_url = null;
		await addUserToDB(msg);
		console.log('User: ', msg.name, ' is created');
		return (1);
	}
	catch(err) {
		console.error('err' + err.msg);
		return (0);
	}
}

export async function validateLogin(msg, fastify) {
	let user;

	try {
		user = await getUserByEmail(msg.email);
	} catch (err) {
		console.error('Error with getting user by email');
		return (err);
	}
	if (!user || !user.password)
		return ({ error: 'User not found' });

	const isValidPassword = await bcrypt.compare(msg.password, user.password);
	if (!isValidPassword)
		return ({ error: 'Incorrect password' });

	try {
		const online = await isOnline(msg.email, (online));
		await updateOnlineStatus(msg.email, !online);
	} catch(err) {
		console.error(err.msg);
		// failed?
	}
	const jwtToken = signFastifyJWT(user, fastify);
	console.log('Generated JWT:', jwtToken);
	return { token: jwtToken, user: user, player: msg.player };
}

