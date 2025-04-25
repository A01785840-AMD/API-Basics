import db from '../db.js';


class UserController {
    async post(req, res) {
        const users = Array.isArray(req.body) ? req.body : [req.body];

        for (const user of users) {
            if (!user.name || !user.email) {
                return res.status(400).json({ message: "Each user must have name and email" });
            }
            if (user.items && !Array.isArray(user.items)) {
                return res.status(400).json({ message: "Items must be an array of item IDs" });
            }
        }

        try {
            const createdUsers = [];

            for (const user of users) {
                const userInsert = await new Promise((resolve, reject) => {
                    db.run('INSERT INTO users (name, email) VALUES (?, ?)',
                        [user.name, user.email],
                        function (err) {
                            if (err) return reject(err);
                            resolve(this.lastID);
                        });
                });

                if (user.items && user.items.length > 0) {
                    const itemChecks = await Promise.all(user.items.map(id =>
                        new Promise((resolve, reject) => {
                            db.get('SELECT id FROM items WHERE id = ?', [id], (err, row) => {
                                if (err) return reject(err);
                                if (!row) return reject(new Error(`Item with id ${id} does not exist`));
                                resolve();
                            });
                        })
                    ));

                    await Promise.all(user.items.map(item_id =>
                        new Promise((resolve, reject) => {
                            db.run('INSERT INTO usersItem (user_id, item_id) VALUES (?, ?)', [userInsert, item_id],
                                function (err) {
                                    if (err) return reject(err);
                                    resolve();
                                });
                        })
                    ));
                }

                createdUsers.push({ id: userInsert });
            }

            res.status(201).json({ message: "Users created successfully", users: createdUsers });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new UserController();