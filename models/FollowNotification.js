//! models/FollowNotification.js

import { promisePool } from '../config/database.js';

class FollowNotification {
	// Create a notification
	static async createFollowNotification(userId, senderId, type) {
		const query = `INSERT INTO follows_notifications (user_id, sender_id, type) VALUES (?, ?, ?)`;
		return promisePool.execute(query, [userId, senderId, type]);
	}

	// Mark a notification as read
	static async deleteNotification(notificationId) {
		const query = `DELETE FROM follows_notifications WHERE id = ?`;
		return promisePool.execute(query, [notificationId]);
	}

	// Get unread notifications for a user
	static async getNotifications(userId) {
		const query = `
        SELECT fn.*, u.username, u.email
        FROM follows_notifications fn
        JOIN users u ON fn.sender_id = u.id
        WHERE fn.user_id = ?
        ORDER BY fn.created_at DESC`;
		const [rows] = await promisePool.execute(query, [userId]);
		return rows;
	}
}

export default FollowNotification;
