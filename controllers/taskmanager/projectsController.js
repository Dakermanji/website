//! controllers/taskmanager/projectsController.js

import errorHandler from '../../middlewares/errorHandler.js';
import Project from '../../models/Project.js';
import Task from '../../models/Task.js';
import Collaboration from '../../models/Collaboration.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import { navBar } from '../../data/navBar.js';
import { getUserFriends } from '../../utils/friends/userFriendsHelper.js';
import { createNotification } from '../../utils/notificationHelper.js';

// Create a new project
export const createProject = async (req, res) => {
	try {
		const { name } = req.body;
		const ownerId = req.user.id;

		const project = await Project.createProject(name, ownerId);
		req.flash('success', 'Project created successfully!');
		res.status(201).json({ project });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
	try {
		const userId = req.user.id;

		// Fetch projects the user owns
		const ownedProjects = await Project.getProjectsByOwner(userId);

		// Fetch projects where the user is a collaborator
		const collaboratedProjects = await Collaboration.getProjectsForUser(
			userId
		);

		const userFriends = await getUserFriends(userId);

		const notifications = await Notification.getUnreadNotiifcationsForUser(
			userId
		);
		const unreadCount = await Notification.countUnread(req.user.id);

		res.render('taskmanager/index', {
			title: 'Task Manager - DWD',
			ownedProjects,
			collaboratedProjects,
			navBar: navBar.projects,
			notifications,
			unreadCount,
			scripts: ['helpers/modalHelper', 'taskmanager'],
			styles: ['taskmanager/modals'],
			userFriends,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Delete a project
export const deleteProject = async (req, res) => {
	try {
		const { projectId } = req.params;
		const userId = req.user.id;

		// Step 1: Fetch project & collaborators before deleting
		const project = await Project.getProjectById(projectId);
		if (!project) {
			req.flash('error', 'Project not found.');
			return res.status(404).json({ error: 'Project not found.' });
		}

		const collaborators = await Collaboration.getProjectCollaborators(
			projectId
		);

		// Step 2: Delete Project
		await Project.deleteProject(projectId);

		// Step 3: Notify all collaborators (except owner)
		for (const collab of collaborators) {
			if (collab.user_id !== userId) {
				await createNotification({
					project: 'taskmanager',
					notifierId: userId,
					notifiedId: collab.user_id,
					description: `The project <strong>${project.name}</strong> has been deleted by its owner.`,
					link: '/taskmanager',
				});
			}
		}

		req.flash('success', 'Project deleted successfully!');
		res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

export const getBoard = async (req, res) => {
	try {
		const { projectId } = req.params;
		const userId = req.user.id;

		const userFriends = await getUserFriends(userId);

		const project = await Project.getProjectById(projectId);

		const isOwner = project.owner_id === userId;
		const collaborators = await Collaboration.getProjectCollaborators(
			projectId
		);

		const userCollab = collaborators.find(
			(collab) => collab.user_id === userId
		);

		const owner = await User.findById(project.owner_id);

		const notifications = await Notification.getUnreadNotiifcationsForUser(
			userId
		);
		const unreadCount = await Notification.countUnread(req.user.id);

		const tasks = await Task.getTasksByProjectId(projectId);
		res.render('taskmanager/board', {
			title: `${project.name} - DWD`,
			project,
			navBar: navBar.projects,
			tasks,
			owner,
			collaborators,
			notifications,
			unreadCount,
			userRole: isOwner ? 'owner' : userCollab?.role,
			userFriends,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
			scripts: ['helpers/modalHelper', 'taskmanager'],
			styles: ['taskmanager/modals', 'taskmanager/tasks'],
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
