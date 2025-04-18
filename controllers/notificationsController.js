//! controllers/notificationsController.js

import Notification from '../models/Notification.js';

export const markAllAsRead = async (req, res) => {
	try {
		await Notification.markAllAsRead(req.user.id);
		res.status(200).json({
			success: true,
			message: 'All notifications marked as read.',
		});
	} catch (error) {
		console.error('Error marking notifications as read:', error);
		res.status(500).json({
			error: 'Failed to mark notifications as read.',
		});
	}
};
