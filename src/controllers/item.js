import db from '../db.js';


class ItemController {
    async post(req, res) {
        const items = Array.isArray(req.body) ? req.body : [req.body];
        for (const item of items) {
            if (!item.name || !item.type || !item.effect) {
                return res.status(400).json({ message: "Each item must have name, type, and effect" });
            }
        }

        const insertPromises = items.map(item => {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO items (name, type, effect) VALUES (?, ?, ?)',
                    [item.name, item.type, item.effect],
                    function (err) {
                        if (err) return reject(err);
                        resolve({ id: this.lastID });
                    }
                );
            });
        });

        try {
            const results = await Promise.all(insertPromises);
            res.status(201).json({ message: "Items created successfully", items: results });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async get(req, res) {
        db.all('SELECT * FROM items', [], (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            if (rows.length === 0) {
                return res.status(200).json({ message: "No items found." });
            }
            res.json(rows);
        });
    }

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
