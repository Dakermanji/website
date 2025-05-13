//! models/ChatMessage.js

import { promisePool } from '../config/database.js';

class ChatMessage {
	static async fetchByReceiver(projectName, receiverId, userId) {
		if (projectName === 'chat') {
			// For friends
			return this.fetchFriendChat(userId, receiverId);
		}
		const query = `SELECT cm.*, u.username
			 FROM chat_messages cm
			 JOIN users u ON cm.user_id = u.id
			 WHERE project_name = ? AND receiver_id = ?
			 ORDER BY created_at ASC`;

		const [rows] = await promisePool.query(query, [
			projectName,
			receiverId,
		]);
		return rows;
	}

	static async create(data) {
		const { id, project_name, receiver_id, user_id, message } = data;
		const query = `INSERT INTO chat_messages (id, project_name, receiver_id, user_id, message)
			 VALUES (?, ?, ?, ?, ?)`;
		await promisePool.query(query, [
			id,
			project_name,
			receiver_id,
			user_id,
			message,
		]);
	}

	static async fetchFriendChat(userId, friendId) {
		const query = `SELECT cm.*, u.username
			 FROM chat_messages cm
			 JOIN users u ON cm.user_id = u.id
			 WHERE project_name = 'chat'
			 AND (
				(cm.user_id = ? AND cm.receiver_id = ?)
				OR
				(cm.user_id = ? AND cm.receiver_id = ?)
			 )
			 ORDER BY created_at ASC`;
		const [rows] = await promisePool.query(query, [
			userId,
			friendId,
			friendId,
			userId,
		]);
		return rows;
	}

	static async fetchById(id) {
		const query = `SELECT cm.*, u.username
			 FROM chat_messages cm
			 JOIN users u ON cm.user_id = u.id
			 WHERE cm.id = ?`;
		const [rows] = await promisePool.query(query, [id]);
		return rows[0] || null;
	}
}

export default ChatMessage;
