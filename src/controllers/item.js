import db from '../db.js';


class ItemController {
    async getById(req, res) {
        const { id } = req.params;
        db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!row) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json(row);
        });
    }
}

export default new ItemController();
