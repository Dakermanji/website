//! models/FollowNotification.js

import { promisePool } from '../config/database.js';

class FollowNotification {
	// Create a notification
	static async createFollowNotification(userId, senderId, type) {
		const query = `INSERT INTO follows_notifications (user_id, sender_id, type) VALUES (?, ?, ?)`;
		return promisePool.execute(query, [userId, senderId, type]);
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
