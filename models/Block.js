//! models/Block.js

import { promisePool } from '../config/database.js';

class Blocks {
	// Check if a user has blocked another user
	static async checkBlockStatus(blockerId, blockedId) {
		const query = `SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [blockerId, blockedId]);
		return rows.length > 0;
	}

	// Create a block entry
	static async blockUser(blockerId, blockedId) {
		const query = `INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)`;
		return promisePool.execute(query, [blockerId, blockedId]);
	}

	// Remove a block entry (unblock a user)
	static async unblockUser(blockerId, blockedId) {
		const query = `DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?`;
		return promisePool.execute(query, [blockerId, blockedId]);
	}

	// Get all users that a user has blocked
	static async getBlocked(userId) {
		const query = `
            SELECT b.blocked_id, u.username, u.email
            FROM blocks b
            JOIN users u ON b.blocked_id = u.id
            WHERE b.blocker_id = ?`;
		const [rows] = await promisePool.execute(query, [userId]);
		return rows;
	}
}

export default Blocks;
