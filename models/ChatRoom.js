//! models/ChatRoom.js

import { promisePool } from '../config/database.js';

class ChatRoom {
	static async fetchAll() {
		const query = `SELECT * FROM chat_rooms`;
		const [rows] = await promisePool.query(query);
		return rows;
	}

	static async fetchById(id) {
		const query = `SELECT ch.*, u.username
			 FROM chat_rooms ch
			 JOIN users u ON ch.creator_id = u.id
			 WHERE ch.id = ?`;
		const [rows] = await promisePool.query(query, [id]);
		return rows[0];
	}

	static async create(data) {
		const { id, name, creator_id, is_locked } = data;
		const query = `INSERT INTO chat_rooms (id, name, creator_id, is_locked)
			 VALUES (?, ?, ?, ?)`;
		await promisePool.query(query, [id, name, creator_id, is_locked]);
	}

	static async fetchOwnedRooms(userId) {
		const query = `SELECT ch.*, u.username
					   FROM chat_rooms ch
					   JOIN users u ON ch.creator_id = u.id
					   WHERE ch.creator_id = ?`;
		const [rows] = await promisePool.query(query, [userId]);
		return rows;
	}
}

export default ChatRoom;
