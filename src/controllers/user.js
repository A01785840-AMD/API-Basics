import db from '../db.js';


class UserController {
    async get(req, res) {
        db.all('SELECT * FROM users', [], async (err, users) => {
            if (err) return res.status(500).json({ message: err.message });
            if (users.length === 0) {
                return res.status(200).json({ message: "No users found." });
            }

            const enrichedUsers = await Promise.all(users.map(user => {
                return new Promise((resolve, reject) => {
                    db.all(`
                        SELECT items.*
                        FROM items
                                 INNER JOIN usersItem ON items.id = usersItem.item_id
                        WHERE usersItem.user_id = ?
                    `, [user.id], (err, items) => {
                        if (err) return reject(err);
                        resolve({ ...user, items });
                    });
                });
            }));

            res.json(enrichedUsers);
        });
    }
}

export default new UserController();