//! models/ChatRoomMember.js

import { promisePool } from '../config/database.js';

class ChatRoomMember {
	static async fetchMembers(roomId) {
		const [rows] = await promisePool.query(
			`SELECT crm.*, u.username
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

	static async isMember(roomId, userId) {
		const [rows] = await promisePool.query(
			`SELECT * FROM chat_room_members
		 WHERE room_id = ? AND user_id = ?`,
			[roomId, userId]
		);
		return rows.length > 0;
	}

	static async fetchUserRooms(userId) {
		const [rows] = await promisePool.query(
			`SELECT crm.*, cr.name
		 FROM chat_room_members crm
		 JOIN chat_rooms cr ON crm.room_id = cr.id
		 WHERE crm.user_id = ?`,
			[userId]
		);
		return rows;
	}
}

export default ChatRoomMember;
