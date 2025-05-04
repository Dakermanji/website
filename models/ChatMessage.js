//! models/ChatMessage.js

import { promisePool } from '../config/database.js';

class ChatMessage {
	static async fetchByReceiver(projectName, receiverId) {
		const [rows] = await promisePool.query(
			`SELECT cm.*, u.username
			FROM chat_messages cm
			JOIN users u ON cm.user_id = u.id
			WHERE cm.project_name = ? AND cm.receiver_id = ?
			ORDER BY cm.created_at ASC`,
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
}

export default ChatMessage;
