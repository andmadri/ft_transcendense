import { addUserToDB, getOnlineUsers, getUserByEmail } from '../Database/users.js';
import bcrypt from 'bcrypt';
import { db } from '../index.js' // DELETE THIS LATER

function checkName(name) {
	const nameRegex = /^[a-zA-Z0-9 _-]+$/;
	if (!name.length)
		return ('Name can not be empty');
	else if (name.length > 30)
		return ('Name is too long');
	else if (!nameRegex.test(name))
		return ("Only letters, numbers, spaces, '-' and '_' are allowed.");
	return (null);
}

function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
		const userId = await addUserToDB(db, msg);
		return (''); // Should we not return the userId?
	}
	catch(err) {
		if (err.code === 'SQLITE_CONSTRAINT') {
			if (err.message.includes('Users.email')) {
				return ('That email is already registered.');
			}
			if (err.message.includes('Users.name')) {
				return ('That username is already taken.');
			}
		}
		console.error('addUser:', err);
		return ('Unknown error occurred while adding user.');
	}
}

export async function validateLogin(msg, fastify) {
	let user;

	try {
		user = await getUserByEmail(db, msg.email);
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
		const onlineUsers = await getOnlineUsers(db);
		for (const onlineUser of onlineUsers) {
			if (onlineUser.id === user.id) {
				return ({ error: 'You are already logged in!' });
			}
		}
	} catch (err) {
		console.error('Error with getting online users');
		return ({ error: 'Database error' });
	}

	return { user: user };
}

