//! controllers/projectsController.js

import { navBar } from '../data/navBar.js';
import FollowNotification from '../models/FollowNotification.js';
import Follow from '../models/Follow.js';
import Block from '../models/Block.js';
import errorHandler from '../middlewares/errorHandler.js';

export const renderProjects = async (req, res, next) => {
	try {
		// Ensure user is logged in before fetching notifications
		const userId = req.user?.id;
		const notifications = userId
			? await FollowNotification.getNotifications(userId)
			: [];
		const follows = userId ? await Follow.getFollows(userId) : [];
		const followers = userId ? await Follow.getFollowers(userId) : [];
		const blocks = userId ? await Block.getBlocked(userId) : [];

		res.render('projects', {
			title: 'Projects - Dakermanji Web Dev',
			navBar: navBar.projects,
			styles: ['friends'],
			scripts: ['helpers/modalHelper', 'friends'],
			notifications,
			follows,
			followers,
			blocks,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
		});
	} catch (error) {
		next(errorHandler(error, req, res, next));
	}
};
