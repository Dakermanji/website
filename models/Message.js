import { promisePool } from '../config/database.js';

class Message {
	// Insert a new message into the database
	static async create({ user_id, subject, message }) {
		const query = `
            INSERT INTO messages (user_id, subject, message)
            VALUES (?, ?, ?)
        `;
		return promisePool.execute(query, [user_id, subject, message]);
	}

	// Fetch all messages (optional)
	static async fetchAll() {
		const query = 'SELECT * FROM messages ORDER BY created_at DESC';
		const [rows] = await promisePool.query(query);
		return rows;
	}
}

export default Message;
