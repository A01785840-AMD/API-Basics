import db from '../db.js';


class ItemController {
    async patch(req, res) {
        const { id } = req.params;
        const fields = [];
        const values = [];

        ['name', 'type', 'effect'].forEach(field => {
            if (req.body[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(req.body[field]);
            }
        });

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        values.push(id);

        db.run(`UPDATE items
                SET ${fields.join(', ')}
                WHERE id = ?`, values, function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json({ message: "Item updated successfully" });
        });
    }
}

export default new ItemController();
