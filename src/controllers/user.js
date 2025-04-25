import db from '../db.js';


class UserController {
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