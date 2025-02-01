//! models/FollowNotification.js

import { promisePool } from '../config/database.js';

class FollowNotification {
	// Create a notification for a follow request
	static async createFollowRequestNotification(userId, senderId) {
		const query = `INSERT INTO follows_notifications (user_id, sender_id, type) VALUES (?, ?, 'follow_request')`;
		return promisePool.execute(query, [userId, senderId]);
	}

	// Create a notification for mutual follow
	static async createMutualFollowNotification(userId, senderId) {
		const query = `INSERT INTO follows_notifications (user_id, sender_id, type) VALUES (?, ?, 'mutual_request')`;
		return promisePool.execute(query, [userId, senderId]);
	}

	// Mark a notification as read
	static async markAsRead(notificationId) {
		const query = `UPDATE follows_notifications SET status = 'read' WHERE id = ?`;
		return promisePool.execute(query, [notificationId]);
	}

	// Get unread notifications for a user
	static async getUnreadNotifications(userId) {
		const query = `SELECT * FROM follows_notifications WHERE user_id = ? AND status = 'unread' ORDER BY created_at DESC`;
		return promisePool.execute(query, [userId]);
	}
}

export default FollowNotification;
