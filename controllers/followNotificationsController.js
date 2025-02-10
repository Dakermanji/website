//! controllers/followNotificationsController.js

import FollowNotification from '../models/FollowNotification.js';
import errorHandler from '../middlewares/errorHandler.js';
import FollowRequest from '../models/FollowRequest.js';

export const deleteNotification = async (req, res, next) => {
	try {
		const notificationId = req.params.id;

		const notification = await FollowNotification.getNotificationById(
			notificationId
		);

		if (notification.type === 'follow_request') {
			await FollowRequest.deleteFollowRequest(
				notification.sender_id,
				notification.user_id
			);
		}

		await FollowNotification.deleteNotification(notificationId);
		res.status(200).json({ message: 'Notification removed successfully.' });
	} catch (error) {
		next(errorHandler(error, req, res, next));
		res.status(500).json({ error: 'Error deleting notification.' });
	}
};
