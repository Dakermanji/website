//! controllers/followNotificationsController.js

import { handleFollowNotificationAction } from '../utils/followNotificationsHelper.js';
import errorHandler from '../middlewares/errorHandler.js';

// Delete Follow Notification
export const deleteFollowNotification = async (req, res, next) => {
	try {
		await handleFollowNotificationAction(
			req.params.id,
			req.user.id,
			'delete'
		);
		res.status(200).json({
			message: 'Follow notification removed successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Accept Follow Request
export const acceptFollowNotification = async (req, res, next) => {
	try {
		await handleFollowNotificationAction(
			req.params.id,
			req.user.id,
			'accept'
		);
		res.status(200).json({
			message: 'Follow request accepted successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};
