import db from '../db.js';


class UserController {
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
}

export default new UserController();