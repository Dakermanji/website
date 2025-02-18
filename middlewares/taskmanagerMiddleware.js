//! middlewares/taskmanagerMiddleware.js

import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';

/**
 * Middleware to check user permissions for a project.
 * @param {string} requiredRole - The required role ("owner", "editor", "viewer").
 */
export const checkProjectAccess = (requiredRole) => {
	return async (req, res, next) => {
		try {
			const { projectId } = req.params;
			const userId = req.user.id;

			// Fetch project details
			const project = await Project.getProjectById(projectId);
			if (!project) {
				req.flash('error', 'Project not found.');
				return res.redirect('/taskmanager/projects');
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
				return res.redirect('/taskmanager/projects');
			}

			if (requiredRole === 'editor' && collab.role !== 'editor') {
				req.flash('error', 'You do not have editor access.');
				return res.redirect(`/taskmanager/projects/${projectId}`);
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
