//! controllers/projectsController.js

import { navBar } from '../data/navBar.js';
import errorHandler from '../middlewares/errorHandler.js';
import { getUserFriends } from '../utils/friends/userFriendsHelper.js';

export const renderProjects = async (req, res, next) => {
	try {
		// Ensure user is logged in before fetching notifications
		const userId = req.user?.id;
		const userFriends = await getUserFriends(userId);

		res.render('projects', {
			title: 'Projects - Dakermanji Web Dev',
			navBar: navBar.projects,
			scripts: ['helpers/modalHelper'],
			userFriends,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
