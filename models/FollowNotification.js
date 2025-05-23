//! models/FollowNotification.js

import { promisePool } from '../config/database.js';

class FollowNotification {
	// Create or update a follow notification
	static async createFollowNotification(userId, senderId, type) {
		const query = `
        INSERT INTO follows_notifications (user_id, sender_id, type)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE type = VALUES(type), created_at = CURRENT_TIMESTAMP;
    `;
		return promisePool.execute(query, [userId, senderId, type]);
	}

	// Mark a notification as read
	static async deleteNotification(notificationId) {
		const query = `DELETE FROM follows_notifications WHERE id = ?`;
		return promisePool.execute(query, [notificationId]);
	}

	static async deleteNotificationByUserAndSenderIds(user_id, sender_id) {
		const query = `DELETE FROM follows_notifications WHERE user_id = ? AND sender_id = ?`;
		const [result] = await promisePool.execute(query, [user_id, sender_id]);
		return result.affectedRows > 0;
	}

	// Get notification by ID
	static async getNotificationById(notificationId) {
		const query = `
        SELECT * FROM follows_notifications
        WHERE id = ?`;
		const [rows] = await promisePool.execute(query, [notificationId]);
		return rows[0];
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

	// Update notification by id
	static async updateNotificationType(senderId, userId, type) {
		const query = `UPDATE follows_notifications SET type = ? WHERE sender_id = ? AND user_id = ?`;
		const [result] = await promisePool.execute(query, [
			type,
			senderId,
			userId,
		]);
		return result.affectedRows > 0;
	}
}

export default FollowNotification;
