//! models/ChatRoom.js

import { promisePool } from '../config/database.js';

class ChatRoom {
	static async fetchAll() {
		const [rows] = await promisePool.query(`SELECT * FROM chat_rooms`);
		return rows;
	}

	static async fetchById(id) {
		const [rows] = await promisePool.query(
			`SELECT * FROM chat_rooms WHERE id = ?`,
			[id]
		);
		return rows[0];
	}

	static async create(data) {
		const { id, name, creator_id, is_locked } = data;
		await promisePool.query(
			`INSERT INTO chat_rooms (id, name, creator_id, is_locked)
			 VALUES (?, ?, ?, ?)`,
			[id, name, creator_id, is_locked]
		);
	}
}

export default ChatRoom;
