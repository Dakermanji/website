import { promisePool } from '../config/database.js';

class Message {
	// Insert a new message into the database
	static async create({ name, email, message }) {
		const query = `
            INSERT INTO messages (name, email, message)
            VALUES (?, ?, ?)
        `;
		return promisePool.execute(query, [name, email, message]);
	}

	// Fetch all messages (optional)
	static async fetchAll() {
		const query = 'SELECT * FROM messages ORDER BY created_at DESC';
		const [rows] = await promisePool.query(query);
		return rows;
	}
}

export default Message;
