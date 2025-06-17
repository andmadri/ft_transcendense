import { db } from './database.js';
import bcrypt from 'bcrypt';

function sendBackToFrontend(connection, accessUserAuth, reasonMsg) {
	const msg = {
		action: "loginCheck",
		access: accessUserAuth,
		reason: reasonMsg
	}
	connection.socket.send(JSON.stringify(msg));
}

function checkName(name) {
	const nameRegex = /^[a-zA-Z0-9_-]+$/;
	if (!name.length || name.length > 30)
		return false;
	return nameRegex.test(name);
}

function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/;
	if (email.length < 3 || email.length > 254)
		return false;
	return emailRegex.test(email);
}

function checkPassword(password) {
	const passwordRegex = /^\S+$/; // No whitespace allowed
	if (!password.length || password.length < 8 || password.length > 64)
		return false;
	return passwordRegex.test(password);
}

async function addUser(msg, connection) {
	if (!checkName(msg.name))
		return sendBackToFrontend(connection, "no", "No valid name");
	if (!checkEmail(msg.email))
		return sendBackToFrontend(connection, "no", "No valid email");
	if (!checkPassword(msg.password))
		return sendBackToFrontend(connection, "no", "No valid password");
	if (db.getUserRowByEmail(msg)) {
		return sendBackToFrontend(connection, "ok", "User allready exist");
	}
	const hashedPassword = bcrypt.hash(msg.password, 10);
	const insert = db.prepare(`
		INSERT INTO Users (name, email, password)
		VALUES (?, ?, ?)
	`);
	insert.run(msg.name, msg.email, hashedPassword);
	db.updateStatus(msg.email, db.getStatus(msg.email));
	return sendBackToFrontend(connection, "ok", "User created");
}

async function validateLogin(msg, connection) {
	const user = db.getUserRowByEmail(msg.email);
	if (!user)
		return sendBackToFrontend(connection, "no", "User not found");
	const isValidPassword = await bcrypt.compare(msg.password, user.password);
	if (!isValidPassword)
		return sendBackToFrontend(connection, "no", "Incorrect password");
	db.updateStatus(msg.email, db.getStatus(msg.email))
	return sendBackToFrontend(connection, "ok", "Login successful")
}

export async function handleUserAuth(msg, connection) {
	if (msg.action == "registerUser")
		return addUser(msg);
	else if (msg.action == "loginUser")
		return validateLogin(msg, connection);
	return sendBackToFrontend(connection, "no", "Unkown action");
}


