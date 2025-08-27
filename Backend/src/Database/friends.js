// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

export async function addFriendRequestDB(db, user_id, friend_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Friends (user_id, friend_id) VALUES (?, ?)`,
			[user_id, friend_id],
			(err) => {
				if (err) {
					if (err.message.includes('UNIQUE')) {
						reject(new Error('Friend request already exists'));
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

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

export function deleteFriendDBfromUser(db, user_id, friend_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`DELETE FROM Friends WHERE user_id = ? AND friend_id = ?`,
			[user_id, friend_id],
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


export async function getFriendsDB(db, player_id) {
	return new Promise((resolve, reject) => {
		const sql = `
			SELECT u.id, u.name
			FROM Friends f
			JOIN Users u ON (u.id = f.friend_id OR u.id = f.user_id)
			WHERE f.accepted = 1 AND ? IN (f.user_id, f.friend_id) AND u.id != ?
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
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //



// *************************************************************************** //
//                         VIEW DATA FROM VIEW TABLES                          //
// *************************************************************************** //

