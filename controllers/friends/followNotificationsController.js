//! controllers/friends/followNotificationsController.js

import { handleFollowNotificationAction } from '../../utils/friends/followNotificationsHelper.js';
import errorHandler from '../../middlewares/errorHandler.js';

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

// Accept And Follow Back Follow Request
export const acceptAndFollowBackFollowNotification = async (req, res, next) => {
	try {
		await handleFollowNotificationAction(
			req.params.id,
			req.user.id,
			'follow_back'
		);
		res.status(200).json({
			message: 'Follow request accepted and followed back successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Block User From Follow Notification
export const blockFollowNotification = async (req, res, next) => {
	try {
		await handleFollowNotificationAction(
			req.params.id,
			req.user.id,
			'block'
		);
		res.status(200).json({
			message: 'Block user has beend has been handled successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Unfollow User From Follow Notification
export const unfollowFollowNotification = async (req, res, next) => {
	try {
		await handleFollowNotificationAction(
			req.params.id,
			req.user.id,
			'unfollow'
		);
		res.status(200).json({
			message: 'Unfollow user has been handled successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Unfollow for Both Users From Follow Notification
export const unfollowBothFollowNotification = async (req, res, next) => {
	try {
		await handleFollowNotificationAction(
			req.params.id,
			req.user.id,
			'unfollow_both'
		);
		res.status(200).json({
			message: 'Unfollow for both users has been handled successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};
