import { sql_log, sql_error } from './dblogger.js';
import { getUserByID } from './users.js';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

async function isAlreadyAnInvite(db, user_id, friend_id, user_id_name, friend_id_name) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT id FROM Friends	WHERE (user_id = ? AND friend_id = ?) LIMIT 1`;
		db.get(sql, [friend_id, user_id], (err, row) => {
			if (err) {
				sql_error(err, `isAlreadyAnInvite | user_id=${user_id}, friend_id=${friend_id}`);
				reject(err);
			} else {
				if (row) {
					sql_log(`${user_id_name} send a friend request to ${friend_id_name}, but ${friend_id_name} did already send a request to ${user_id_name}: accept friend request [${row.id}]`);
				}
				resolve(row || null);
			}
		});
	});
}

export async function addFriendRequestDB(db, user_id, friend_id) {
	const user1 = await getUserByID(db, user_id);
	const user2 = await getUserByID(db, friend_id);
	if (!user1 || !user2) {
		throw new Error(`addFriendRequestDB | ${user_id} and/or ${friend_id} does not exist.`);
	}

	try {
		const requestID = await isAlreadyAnInvite(db, user_id, friend_id, user1.name, user2.name);
		if (requestID) {
			return await acceptFriendRequestDB(db, requestID.id, user1.name, user2.name);
		}
	} catch (err) {
		return err;
	}

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO Friends (user_id, friend_id) VALUES (?, ?)`;
		db.run(sql, [user_id, friend_id], function (err) {
			if (err) {
				if (err.message.includes('UNIQUE')) {
					sql_log(`${user1.name} already sended a friend request to ${user2.name}`);
					reject(new Error('You already invited this player'));
				} else {
					reject(err);
				}
			} else {
				sql_log(`${user1.name} send a friend request to ${user2.name}. Friend request [${this.lastID}]`);
				resolve(this.lastID);
			}
		});
	});
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

export async function acceptFriendRequestDB(db, request_id, user1_name, user2_name) {
	if (!user1_name || !user2_name) {
		const request = await getFriendRequestByID(db, request_id);
		if (!request) {
			throw new Error(`acceptFriendRequestDB | Can not find friend request in DB with request_id=${request_id}.`);
		}
		const user1 = await getUserByID(db, request.user_id);
		const user2 = await getUserByID(db, request.friend_id);
		if (!user1 || !user2) {
			throw new Error(`acceptFriendRequestDB | ${request.user_id} and/or ${request.friend_id} does not exist.`);
		}
		user1_name = user1.name;
		user2_name = user2.name;
	}

	return new Promise((resolve, reject) => {
		const sql = `UPDATE Friends SET accepted = 1 WHERE id = ? AND accepted = 0`;
		db.run(sql, [request_id], function(err) {
			if (err) {
				sql_error(err, `acceptFriendRequestDB | request_id=${request_id}, players: ${user1_name} and ${user2_name}`);
				reject(err);
			} else {
				if (this.changes !== 0) {
					sql_log(`Friend request [${request_id}] accepted: ${user1_name} and ${user2_name} are now friends.`);
				}
				resolve(this.lastID);
			}
		});
	});
}

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

export async function denyFriendRequestDB(db, request_id) {
	const request = await getFriendRequestByID(db, request_id);
	if (!request) {
		throw new Error(`denyFriendRequestDB | Can not find friend request in DB with request_id=${request_id}.`);
	}
	const user1 = await getUserByID(db, request.user_id);
	const user2 = await getUserByID(db, request.friend_id);
	if (!user1 || !user2) {
		throw new Error(`denyFriendRequestDB | ${request.user_id} and/or ${request.friend_id} does not exist.`);
	}

	return new Promise((resolve, reject) => {
		const sql = `DELETE FROM Friends WHERE id = ? AND accepted = 0`;
		db.run(sql, [request_id], function (err) {
			if (err) {
				sql_error(err, `denyFriendRequestDB | request_id=${request_id}`);
				reject(err);
			} else {
				if (this.changes !== 0) {
					sql_log(`Friend request [${request_id}] denied: ${user1.name} and ${user2.name} are not friends.`);
				}
				resolve();
			}
		});
	});
}

export async function deleteFriendDB(db, user_id, friend_id) {
	const request = await getFriendRequestByUserIDs(db, user_id, friend_id);
	if (!request) {
		throw new Error(`deleteFriendDB | Can not find friend request in DB with user_id=${user_id}, friend_id=${friend_id}.`);
	}
	const user1 = await getUserByID(db, user_id);
	const user2 = await getUserByID(db, friend_id);
	if (!user1 || !user2) {
		throw new Error(`deleteFriendDB | ${user_id} and/or ${friend_id} does not exist.`);
	}
	return new Promise((resolve, reject) => {
		const sql = `DELETE FROM Friends WHERE (user_id = ? AND friend_id = ? AND accepted = 1) 
					OR (user_id = ? AND friend_id = ? AND accepted = 1)`;
		db.run(sql, [user_id, friend_id, friend_id, user_id], function (err) {
			if (err) {
				sql_error(err, `deleteFriendDB | user_id=${user_id}, friend_id=${friend_id}`);
				reject(err);
			} else {
				sql_log(`Friendship [${request.id}] deleted: ${user1.name} - ${user2.name}`);
				resolve();
			}
		});
	});
}

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

export async function getFriendRequestByUserIDs(db, user1_id, user2_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`;
		db.get(sql, [user1_id, user2_id, user2_id, user1_id], (err, row) => {
			if (err) {
				sql_error(err, `getFriendRequestByUserIDs | user1_id=${user1_id}, user2_id=${user2_id}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getFriendRequestByUserIDs | No friend request found with user1_id=${user1_id} and user2_id=${user2_id}`);
				}
				resolve(row || null);
			}
		});
	});
}

export async function getFriendRequestByID(db, requestID) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM Friends  WHERE id = ?`;
		db.get(sql, [requestID], (err, row) => {
			if (err) {
				sql_error(err, `getFriendRequestByID | requestID=${requestID}`);
				reject(err);
			} else {
				if (!row) {
					sql_log(`getFriendRequestByID | No friend request found with requestID=${requestID}`);
				}
				resolve(row || null);
			}
		});
	});
}

export async function getOpenFriendRequestsDB(db, player_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT f.id, u.id as requester_id, u.name as requester_name
			FROM Friends f JOIN Users u ON u.id = f.user_id	WHERE f.friend_id = ? AND f.accepted = 0`;
		db.all(sql, [player_id], (err, rows) => {
			if (err) {
				sql_error(err, `getOpenFriendRequestsDB | player_id=${player_id}`);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

export async function getFriendsDB(db, player_id) {
	return new Promise((resolve, reject) => {
		const sql = `
			SELECT 
				u.id, 
				u.name,
				CASE 
					WHEN us.state IS NULL OR us.state = 'logout' THEN 0
					ELSE 1
				END AS online_status
			FROM Friends f
			JOIN Users u 
				ON (u.id = f.friend_id OR u.id = f.user_id)
			LEFT JOIN (
				SELECT us1.user_id, us1.state
				FROM UserSessions us1
				WHERE us1.id = (
					SELECT us2.id
					FROM UserSessions us2
					WHERE us2.user_id = us1.user_id
					ORDER BY us2.timestamp DESC
					LIMIT 1
				)
			) us ON u.id = us.user_id
			WHERE f.accepted = 1 
			  AND ? IN (f.user_id, f.friend_id) 
			  AND u.id != ?
		`;
		db.all(sql, [player_id, player_id], (err, rows) => {
			if (err) {
				sql_error(err, `getFriendsDB | player_id=${player_id}`);
				return reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

export async function getFriendsOnlyIdDB(db, player_id) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT u.id FROM Friends f	JOIN Users u ON (u.id = f.friend_id OR u.id = f.user_id)
			WHERE f.accepted = 1 AND ? IN (f.user_id, f.friend_id) AND u.id != ?`;
		db.all(sql, [player_id, player_id], (err, rows) => {
			if (err) {
				sql_error(err, `getFriendsOnlyIdDB | player_id=${player_id}`);
				return reject(err);
			} else {
				resolve(rows.map(r => r.id));
			}
		});
	});
}
