// *************************************************************************** //
//                             ADD ROW TO SQL TABLE                            //
// *************************************************************************** //

export async function addFriend(db, user_id, friend_id) {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO Friends (user_id, friend_id) VALUES (?, ?)`,
			[user_id, friend_id],
			(err) =>{
				if (err)
					reject(err);
				else
					resolve();
			}
		)
	})
}

// *************************************************************************** //
//                          DELETE ROW FROM SQL TABLE                          //
// *************************************************************************** //

export function deleteFriend(db, user_id, friend_id) {
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

// *************************************************************************** //
//                           VIEW DATA FROM SQL TABLE                          //
// *************************************************************************** //



// *************************************************************************** //
//                         VIEW DATA FROM VIEW TABLES                          //
// *************************************************************************** //

