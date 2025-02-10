//! models/FollowRequest.js

import { promisePool } from '../config/database.js';

class FollowRequest {
	// Check if a follow request exists between two users
	static async isRequestExists(requesterId, recipientId) {
		const query = `SELECT * FROM follow_requests
		               WHERE follower_id = ? AND followee_id = ?`;
		const [rows] = await promisePool.execute(query, [
			requesterId,
			recipientId,
		]);
		return rows.length > 0;
	}

	// Create a follow request
	static async createFollowRequest(requesterId, recipientId) {
		const query = `INSERT INTO follow_requests (follower_id, followee_id) VALUES (?, ?)`;
		return promisePool.execute(query, [requesterId, recipientId]);
	}

	// Delete follow request
	static async deleteFollowRequest(requesterId, recipientId) {
		const query = `DELETE FROM follow_requests WHERE follower_id = ? AND followee_id = ?`;
		return promisePool.execute(query, [requesterId, recipientId]);
	}
}

export default FollowRequest;
