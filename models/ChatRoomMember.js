//! models/ChatRoomMember.js

import { promisePool } from '../config/database.js';

class ChatRoomMember {
	static async fetchMembers(roomId) {
		const query = `SELECT crm.*, u.username
			FROM chat_room_members crm
			JOIN users u ON crm.user_id = u.id
			WHERE crm.room_id = ?`;
		const [rows] = await promisePool.query(query, [roomId]);
		return rows;
	}

	static async addMember(roomId, userId) {
		const query = `INSERT IGNORE INTO chat_room_members (room_id, user_id)
			 VALUES (?, ?)`;
		await promisePool.query(query, [roomId, userId]);
	}

	static async acceptMember(roomId, userId) {
		const query = `
			UPDATE chat_room_members
			SET accepted_at = CURRENT_TIMESTAMP
			WHERE room_id = ? AND user_id = ?
		`;
		await promisePool.query(query, [roomId, userId]);
	}

	static async removeMember(roomId, userId) {
		const query = `DELETE FROM chat_room_members
			 WHERE room_id = ? AND user_id = ?`;
		await promisePool.query(query, [roomId, userId]);
	}

	static async isMember(roomId, userId) {
		const query = `SELECT * FROM chat_room_members
		 WHERE room_id = ? AND user_id = ?`;
		const [rows] = await promisePool.query(query, [roomId, userId]);
		return rows.length > 0;
	}

	static async fetchUserRooms(userId) {
		const query = `SELECT crm.*, cr.name
		 FROM chat_room_members crm
		 JOIN chat_rooms cr ON crm.room_id = cr.id
		 WHERE crm.user_id = ?`;
		const [rows] = await promisePool.query(query, [userId]);
		return rows;
	}
}

export default ChatRoomMember;
