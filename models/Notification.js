//! models/Notification.js

import { promisePool } from '../config/database.js';

class Notification {
	// Create a new notification
	static async create({
		project,
		notifier_id,
		notified_id,
		description,
		link,
	}) {
		const [result] = await promisePool.query(
			`INSERT INTO notifications (project, notifier_id, notified_id, description, link)
		 VALUES (?, ?, ?, ?, ?)`,
			[project, notifier_id, notified_id, description, link]
		);
		return result.insertId;
	}

	// Get a specific notification for a specific user
	static async getNotificationByIdForAUser(notificationId, userId) {
		const [rows] = await promisePool.query(
			`SELECT * FROM notifications
			 WHERE id = ? AND notified_id = ? LIMIT 1`,
			[notificationId, userId]
		);
		return rows[0];
	}

	// Get all notifications for a user (most recent first)
	static async getUnreadNotiifcationsForUser(userId) {
		const [rows] = await promisePool.query(
			`SELECT * FROM notifications
			 WHERE notified_id = ? AND is_read = FALSE
			 ORDER BY created_at DESC`,
			[userId]
		);
		return rows;
	}

	// Mark a notification as read
	static async markAsRead(notificationId) {
		await promisePool.query(
			`UPDATE notifications SET is_read = TRUE WHERE id = ?`,
			[notificationId]
		);
	}

	// Mark all notifications as read for a user
	static async markAllAsRead(userId) {
		await promisePool.query(
			`UPDATE notifications SET is_read = TRUE WHERE notified_id = ?`,
			[userId]
		);
	}

	// Count unread notifications for a user
	static async countUnread(userId) {
		const [rows] = await promisePool.query(
			`SELECT COUNT(*) AS count FROM notifications WHERE notified_id = ? AND is_read = FALSE`,
			[userId]
		);
		return rows[0].count;
	}
}

export default Notification;
