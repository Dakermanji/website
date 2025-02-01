//! models/FollowRequest.js

import { promisePool } from '../config/database.js';

class FollowRequest {
	// Check the follow request status between two users
	static async checkFollowStatus(requesterId, recipientId) {
		const query = `SELECT status FROM follow_requests WHERE follower_id = ? AND followee_id = ?`;
		const [rows] = await promisePool.execute(query, [
			requesterId,
			recipientId,
		]);
		return rows.length ? rows[0].status : null;
	}

	// Create a follow request
	static async createFollowRequest(requesterId, recipientId) {
		const query = `INSERT INTO follow_requests (id, follower_id, followee_id, status) VALUES (UUID(), ?, ?, 'pending')`;
		return promisePool.execute(query, [requesterId, recipientId]);
	}

	// Update follow request status
	static async updateFollowRequestStatus(requesterId, recipientId, status) {
		const query = `UPDATE follow_requests SET status = ? WHERE follower_id = ? AND followee_id = ?`;
		return promisePool.execute(query, [status, requesterId, recipientId]);
	}
}

export default FollowRequest;
