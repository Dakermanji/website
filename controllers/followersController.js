//! controllers/followersController.js

import { handleFollowersAction } from '../utils/followersHelper.js';
import errorHandler from '../middlewares/errorHandler.js';

// Block User From Follow Notification
export const blockFollower = async (req, res, next) => {
	try {
		await handleFollowersAction(req.params.id, req.user.id, 'block');
		res.status(200).json({
			message: 'The user blocked successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Unfollow User From Follow Notification
export const followBackFollower = async (req, res, next) => {
	try {
		await handleFollowersAction(req.params.id, req.user.id, 'followBack');
		res.status(200).json({
			message: 'Unfollow user has been handled successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Unfollow for Both Users From Follow Notification
export const unfollowBothFollower = async (req, res, next) => {
	try {
		await handleFollowersAction(
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
