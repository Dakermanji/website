//! models/ChatMessage.js

import { promisePool } from '../config/database.js';

class ChatMessage {
	static async fetchByReceiver(projectName, receiverId, userId) {
		if (projectName === 'chat') {
			// For friends
			return this.fetchFriendChat(userId, receiverId);
		}

		const [rows] = await promisePool.query(
			`SELECT cm.*, u.username
			 FROM chat_messages cm
			 JOIN users u ON cm.user_id = u.id
			 WHERE project_name = ? AND receiver_id = ?
			 ORDER BY created_at ASC`,
			[projectName, receiverId]
		);
		return rows;
	}

	static async create(data) {
		const { id, project_name, receiver_id, user_id, message } = data;
		await promisePool.query(
			`INSERT INTO chat_messages (id, project_name, receiver_id, user_id, message)
			 VALUES (?, ?, ?, ?, ?)`,
			[id, project_name, receiver_id, user_id, message]
		);
	}

	static async fetchFriendChat(userId, friendId) {
		const [rows] = await promisePool.query(
			`SELECT cm.*, u.username
			 FROM chat_messages cm
			 JOIN users u ON cm.user_id = u.id
			 WHERE project_name = 'chat'
			 AND (
				(cm.user_id = ? AND cm.receiver_id = ?)
				OR
				(cm.user_id = ? AND cm.receiver_id = ?)
			 )
			 ORDER BY created_at ASC`,
			[userId, friendId, friendId, userId]
		);
		return rows;
	}
}

export default ChatMessage;
