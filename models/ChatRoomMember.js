//! models/ChatRoomMember.js

import { promisePool } from '../config/database.js';

class ChatRoomMember {
	static async fetchMembers(roomId) {
		const [rows] = await promisePool.query(
			`SELECT crm.*, u.display_name AS username
			FROM chat_room_members crm
			JOIN users u ON crm.user_id = u.id
			WHERE crm.room_id = ?`,
			[roomId]
		);
		return rows;
	}

	static async addMember(roomId, userId) {
		await promisePool.query(
			`INSERT IGNORE INTO chat_room_members (room_id, user_id)
			 VALUES (?, ?)`,
			[roomId, userId]
		);
	}

	static async removeMember(roomId, userId) {
		await promisePool.query(
			`DELETE FROM chat_room_members
			 WHERE room_id = ? AND user_id = ?`,
			[roomId, userId]
		);
	}
}

export default ChatRoomMember;
