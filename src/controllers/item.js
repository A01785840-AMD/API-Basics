import db from '../db.js';


class ItemController {
    async get(req, res) {
        db.all('SELECT * FROM items', [], (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            if (rows.length === 0) {
                return res.status(200).json({ message: "No items found." });
            }
            res.json(rows);
        });
    }
}

export default new ItemController();
