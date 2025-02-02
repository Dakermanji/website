//! models/FollowRequest.js

import { promisePool } from '../config/database.js';

class FollowRequest {
	// Check the follow request status between two users
	static async checkFollowStatus(requesterId, recipientId) {
		const query = `SELECT frs.status FROM follow_requests fr
                       JOIN follow_request_status frs ON fr.status_id = frs.id
                       WHERE follower_id = ? AND followee_id = ?`;
		const [rows] = await promisePool.execute(query, [
			requesterId,
			recipientId,
		]);
		return rows.length ? rows[0].status : null;
	}

	// Create a follow request
	static async createFollowRequest(requesterId, recipientId) {
		const query = `INSERT INTO follow_requests (follower_id, followee_id, status_id)
                       VALUES (?, ?, (SELECT id FROM follow_request_status WHERE status = 'pending' LIMIT 1))`;
		return promisePool.execute(query, [requesterId, recipientId]);
	}

	// Update follow request status
	static async updateFollowRequestStatus(requesterId, recipientId, status) {
		const query = `UPDATE follow_requests SET status_id =
              (SELECT id FROM follow_request_status WHERE status = ? LIMIT 1)
              WHERE follower_id = ? AND followee_id = ?`;

		return promisePool.execute(query, [status, requesterId, recipientId]);
	}
}

export default FollowRequest;
