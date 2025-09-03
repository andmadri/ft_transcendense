import { sql_log, sql_error } from './dblogger.js';

// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

async function isAlreadyAnInvite(db, user_id, friend_id) {
	return new Promise((resolve, reject) => {
		const checkSql = `
			SELECT id FROM Friends
			WHERE (user_id = ? AND friend_id = ?)
			LIMIT 1
		`;
		db.get(
			checkSql,
			[friend_id, user_id],	
			(err, row) => {
				if (err)
					return reject(err);
				if (row) {
					resolve(row.id);
				} else {
					resolve(null);
				}
			}
		);
	});
};

export async function addFriendRequestDB(db, user_id, friend_id) {
	try {
		const requestID = await isAlreadyAnInvite(db, user_id, friend_id);
		if (requestID) {
			// friend already did a request;
			acceptFriendRequestDB(db, requestID);
			return ;
		}
	} catch (err) {
		console.log(err);
		return ;
	}

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Friends (user_id, friend_id) VALUES (?, ?)`,
			[user_id, friend_id],
			(err) => {
				if (err) {
					if (err.message.includes('UNIQUE')) {
						reject(new Error('You already invited this player'));
					} else {
						reject(err);
					}
				} else {
					resolve();
				}
			}
		);
	});
}

// *************************************************************************** //
//                          CHANGE ROW FROM SQL TABLE                          //
// *************************************************************************** //

export async function acceptFriendRequestDB(db, requestId) {
	return new Promise((resolve, reject) => {
		const sql = `UPDATE Friends SET accepted = 1 WHERE id = ? AND accepted = 0`;
		db.run(sql, [requestId], function(err) {
    		if (err) {
    			reject(err);
    		} else if (this.changes === 0) {
    			reject(new Error("No pending friend request found"));
    		} else {
    			resolve();
    		}
    	});
	});
}

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

export async function denyFriendRequestDB(db, requestId) {
	return new Promise((resolve, reject) => {
		const sql = `DELETE FROM Friends WHERE id = ? AND accepted = 0`;
		db.run(sql, [requestId], function(err) {
			if (err) {
				reject(err);
			} else if (this.changes === 0) {
			reject(new Error("No pending friend request found"));
			} else {
		  		resolve();
			}
		});
	});
}

export function deleteFriendDBfromUser(db, user_id, friend_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`DELETE FROM Friends 
			WHERE (user_id = ? AND friend_id = ?) 
			OR (user_id = ? AND friend_id = ?)`,
			[user_id, friend_id, friend_id, user_id],
			function (err) {
				if (err)
					reject(err);
				else
					resolve();
			}
		)
	})
}

export function deleteFriendDBfromID(db, request_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`DELETE FROM Friends WHERE id = ?`,
			[request_id],
			function (err) {
				if (err)
					reject(err);
				else
					resolve();
			}
		)
	})
}

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //

export async function getOpenFriendRequestsDB(db, player_id) {
	return new Promise((resolve, reject) => {
		const sql = `
			SELECT f.id, u.id as requester_id, u.name as requester_name
			FROM Friends f
			JOIN Users u ON u.id = f.user_id
			WHERE f.friend_id = ? AND f.accepted = 0
		`;
		db.all(sql, [player_id], (err, rows) => {
			if (err)
				return reject(err);
			else
				resolve(rows);
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
			if (err) return reject(err);
			resolve(rows);
		});
	});
}

export async function getFriendsOnlyIdDB(db, player_id) {
	return new Promise((resolve, reject) => {
		const sql = `
			SELECT u.id
			FROM Friends f
			JOIN Users u ON (u.id = f.friend_id OR u.id = f.user_id)
			WHERE f.accepted = 1 AND ? IN (f.user_id, f.friend_id) AND u.id != ?
		`;
		db.all(sql, [player_id, player_id], (err, rows) => {
			if (err) return reject(err);
			resolve(rows.map(r => r.id));
		});
	});
}

// *************************************************************************** //
//                         VIEW DATA FROM VIEW TABLES                          //
// *************************************************************************** //

