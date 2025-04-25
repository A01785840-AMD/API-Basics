import db from '../db.js';


class ItemController {
    async delete(req, res) {
        const { id } = req.params;
        db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json({ message: "Item deleted successfully" });
        });
    }
}

export default new ItemController();
