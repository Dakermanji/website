//! middlewares/taskmanagerMiddleware.js

import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';
import Task from '../models/Task.js'; // Import Task to retrieve projectId from task

/**
 * Middleware to check user permissions for a project.
 * @param {string} requiredRole - The required role ("owner", "editor", "viewer").
 */
export const checkProjectAccess = (requiredRole) => {
	return async (req, res, next) => {
		try {
			let projectId = req.params.projectId || req.body.projectId;

			// If no projectId is provided, check if it's a task route (taskId is provided)
			if (!projectId && req.params.taskId) {
				const task = await Task.getTaskById(req.params.taskId);
				if (task) projectId = task.project_id;
			}

			if (!projectId) {
				req.flash('error', 'Invalid request: No project associated.');
				return res.redirect('/taskmanager');
			}

			const userId = req.user.id;

			// Fetch project details
			const project = await Project.getProjectById(projectId);
			if (!project) {
				req.flash('error', 'Project not found.');
				return res.redirect('/taskmanager');
			}

			// Owners have full access
			if (project.owner_id === userId) return next();

			// Check if the user is a collaborator
			const collab = await Collaboration.getCollaboration(
				projectId,
				userId
			);

			// Access control based on role
			if (!collab && requiredRole !== 'viewer') {
				req.flash('error', 'You do not have access to this project.');
				return res.redirect('/taskmanager');
			}

			if (requiredRole === 'editor' && collab.role !== 'editor') {
				req.flash('error', 'You do not have editor access.');
				return res.redirect(`/taskmanager/${projectId}`);
			}

			// Allow access if the role requirement is met
			next();
		} catch (error) {
			console.error('Error checking project access:', error);
			req.flash('error', 'Access denied.');
			res.redirect('/taskmanager/projects');
		}
	};
};
