import { addUserToDB, getOnlineUsers, getUserByEmail, nameAlreadyExist, emailAlreadyExist } from '../Database/users.js';
import bcrypt from 'bcrypt';
import { db } from '../index.js' // DELETE THIS LATER

export async function checkName(name) {
	const nameRegex = /^[a-zA-Z0-9 _-]+$/;
	let exists = null;
	try {
		exists = await nameAlreadyExist(db, name);
	} catch (err) {
		console.error('CHECK_NAME_ERROR', `Error checking if name exists: ${err.message || err}`, 'checkName');
	}
	if (!name.length)
		return ('Name can not be empty');
	else if (name.length > 10)
		return ("Name is too long (min 10 characters)");
	else if (!nameRegex.test(name))
		return ("Only letters, numbers, spaces, '-' and '_' are allowed.");
	else if (exists)
		return ("That username is already taken");
	return (null);
}

export async function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const exists = await emailAlreadyExist(db, email);
	if (!email.length)
		return ('Email can not be empty');
	else if (email.length < 3)
		return ('Email is too short');
	else if (email.length > 254)
		return ('Email is too long');
	else if (!emailRegex.test(email))
		return ('Email has no @ and dot or forbidden characters');
	else if (exists)
		return ("That email is already taken");
	return (null);
}

export function checkPassword(password) {
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

	errorMsg = await checkName(msg.name);
	if (errorMsg)
		return (errorMsg);
	errorMsg = await checkEmail(msg.email);
	if (errorMsg)
		return (errorMsg);
	errorMsg = checkPassword(msg.password);
	if (errorMsg)
		return (errorMsg);
	try {
		await addUserToDB(db, msg);
		return ('');
	}
	catch(err) {
		console.error('ADD_USER_ERROR', err.message || err, 'addUser');
		return ('Unknown error occurred while adding user.');
	}
}

export async function validateLogin(msg, fastify) {
	let user = null;
	try {
		user = await getUserByEmail(db, msg.email);
		if (!user || !user.password)
			return ({ error: 'User not found' });
	} catch (err) {
		return ({ error: 'User not found' });
	}

	const isValidPassword = await bcrypt.compare(msg.password, user.password);
	if (!isValidPassword)
		return ({ error: 'Incorrect password' });

	try {
		const onlineUsers = await getOnlineUsers(db);
		for (const onlineUser of onlineUsers) {
			if (onlineUser.id === user.id) {
				return ({ error: 'You are already logged in!' });
			}
		}
	} catch (err) {
		console.error('GET_ONLINE_USERS_ERROR', err.message || err, 'validateLogin');
		return ({ error: 'Database error' });
	}

	return { user: user };
}

