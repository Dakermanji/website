//! controllers/projectsController.js

import { navBar } from '../data/navBar.js';
import errorHandler from '../middlewares/errorHandler.js';
import Notification from '../models/Notification.js';
import { getUserFriends } from '../utils/friends/userFriendsHelper.js';
import { projects } from '../data/projectsData.js';

export const renderProjects = async (req, res, next) => {
	try {
		const userId = req.user?.id;
		const userFriends = await getUserFriends(userId);
		const notifications = await Notification.getUnreadNotiifcationsForUser(
			userId
		);
		const unreadCount = await Notification.countUnread(req.user.id);

		res.render('projects', {
			title: 'Projects - DWD',
			navBar: navBar.projects,
			projects,
			scripts: ['helpers/modalHelper'],
			styles: ['projects'],
			userFriends,
			notifications,
			unreadCount,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
