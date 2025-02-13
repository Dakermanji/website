//! controllers/blocksController.js

import { handleBlockersAction } from '../utils/blockersHelper.js';
import errorHandler from '../middlewares/errorHandler.js';

// Unblock User
export const unblockBlocked = async (req, res, next) => {
	try {
		await handleBlockersAction(req.params.id, req.user.id, 'unblock');
		res.status(200).json({
			message: 'The user unblocked successfully.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};

// Unblock User and follow
export const unblockAndFollowBlocked = async (req, res, next) => {
	try {
		await handleBlockersAction(
			req.params.id,
			req.user.id,
			'unblock_follow'
		);
		res.status(200).json({
			message:
				'The user has been unblocked successfully and a request to follow also been sent.',
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};
