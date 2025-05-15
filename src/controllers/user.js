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

    async getById(req, res) {
        const { id } = req.params;
        db.get('SELECT * FROM users WHERE id = ?', [id], async (err, user) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            db.all(`
                SELECT *
                FROM items as i 
                         INNER JOIN usersItem ON i.id = usersItem.item_id
                WHERE usersItem.user_id = ?
            `, [id], (err, items) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }

                console.log({...user, items});
                res.json({ ...user, items });
            });
        });
    }

    async patch(req, res) {
        const { id } = req.params;
        const fields = [];
        const values = [];

        ['name', 'email'].forEach(field => {
            if (req.body[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(req.body[field]);
            }
        });

        values.push(id);

        const updateUser = () => {
            return new Promise((resolve, reject) => {
                if (fields.length === 0) return resolve();

                db.run(`UPDATE users
                        SET ${fields.join(', ')}
                        WHERE id = ?`, values, function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject({ notFound: true });
                    resolve();
                });
            });
        };

        const updateItems = () => {
            return new Promise((resolve, reject) => {
                if (!Array.isArray(req.body.items)) return resolve();

                db.run(`DELETE
                        FROM usersItem 
                        WHERE user_id = ?`, [id], function (err) {
                    if (err) return reject(err);

                    const placeholders = req.body.items.map(() => '(?, ?)').join(', ');
                    const itemValues = req.body.items.flatMap(itemId => [id, itemId]);

                    if (itemValues.length === 0) return resolve();

                    db.run(`INSERT INTO  usersItem (user_id, item_id)
                            VALUES ${placeholders}`, itemValues, function (err) {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        };

        try {
            await updateUser();
            await updateItems();
            res.json({ message: "User updated successfully" });
        } catch (err) {
            if (err?.notFound) return res.status(404).json({ message: "User not found" });
            res.status(500).json({ message: err.message || "Server error" });
        }
    }


    async delete(req, res) {
        const { id } = req.params;
        db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        });
    }

}

export default new UserController();