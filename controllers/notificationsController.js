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

export const markAndRedirect = async (req, res) => {
	const { notificationId } = req.params;
	const userId = req.user.id;

	try {
		const notification = await Notification.getNotificationByIdForAUser(
			notificationId,
			userId
		);

		if (!notification) {
			req.flash('error', 'Notification not found or access denied.');
			return res.redirect('/'); // fallback route
		}

		await Notification.markAsRead(notificationId);

		res.redirect(notification.link || '/');
	} catch (error) {
		console.error('Failed to mark notification as read:', error);
		req.flash('error', 'Something went wrong.');
		res.redirect('/');
	}
};
