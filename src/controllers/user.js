import db from '../db.js';


class UserController {
    async getById(req, res) {
        const { id } = req.params;
        db.get('SELECT * FROM users WHERE id = ?', [id], async (err, user) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            db.all(`
                SELECT items.*
                FROM items
                         INNER JOIN usersItem ON items.id = usersItem.item_id
                WHERE usersItem.user_id = ?
            `, [id], (err, items) => {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ ...user, items });
            });
        });
    }
}

export default new UserController();