//! controllers/friends/followsController.js

import { handleFollowsAction } from '../../utils/friends/followsHelper.js';
import errorHandler from '../../middlewares/errorHandler.js';

// Block User From Follow Notification
export const blockFollow = async (req, res, next) => {
	try {
		await handleFollowsAction(req.params.id, req.user.id, 'block');
		res.status(200).json({
			message: 'The user blocked successfully.',
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Unfollow User From Follow Notification
export const unfollowFollow = async (req, res, next) => {
	try {
		await handleFollowsAction(req.params.id, req.user.id, 'unfollow');
		res.status(200).json({
			message: 'Unfollow user has been handled successfully.',
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Unfollow for Both Users From Follow Notification
export const unfollowBothFollow = async (req, res, next) => {
	try {
		await handleFollowsAction(req.params.id, req.user.id, 'unfollow_both');
		res.status(200).json({
			message: 'Unfollow for both users has been handled successfully.',
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
