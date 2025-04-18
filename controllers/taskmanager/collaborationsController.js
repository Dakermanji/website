//! controllers/taskmanager/collaborationController.js

import errorHandler from '../../middlewares/errorHandler.js';
import Collaboration from '../../models/Collaboration.js';
import User from '../../models/User.js';
import Project from '../../models/Project.js';
import { createNotification } from '../../utils/notificationHelper.js';

// Add a collaborator to a project
export const addCollaborator = async (req, res) => {
	try {
		const { projectId, email, role } = req.body;
		const userId = req.user.id;

		const project = await Project.getProjectById(projectId);
		if (!project) {
			req.flash('error', 'Project not found.');
			return res.status(404).json({ error: 'Project not found.' });
		}

		// Ensure only the owner can add collaborators
		if (project.owner_id !== userId) {
			req.flash('error', 'Only the project owner can add collaborators.');
			return res.status(403).json({
				error: 'Only the project owner can add collaborators.',
			});
		}

		// Check if the user exists
		const user = await User.findByEmail(email);
		if (!user) {
			req.flash('error', 'User not found.');
			return res.status(404).json({ error: 'User not found.' });
		}

		// Prevent owner from being added as a collaborator
		if (user.id === project.owner_id) {
			req.flash('error', 'The project owner is already a collaborator.');
			return res.status(400).json({
				error: 'The project owner is already a collaborator.',
			});
		}

		// Check if the user is already a collaborator
		const existingCollab = await Collaboration.getCollaboration(
			projectId,
			user.id
		);

		if (existingCollab) {
			// No change made
			if (existingCollab.role === role) {
				req.flash(
					'error',
					`The collaborator you are adding is already ${role}`
				);
				return res.status(200).json({
					error: `The collaborator you are adding is already ${role}`,
				});
			}

			// Update the role if already a collaborator
			await Collaboration.updateUserRole(projectId, user.id, role);
			// 🔁 Send role update notification
			await createNotification({
				project: 'taskmanager',
				notifierId: userId,
				notifiedId: user.id,
				description: `Your role has been updated to <strong>${role}</strong> in project <strong>${project.name}</strong>.`,
				link: `/taskmanager/${projectId}`,
			});
			req.flash('success', 'User role updated successfully!');
			return res.status(200).json({
				success: 'User role updated successfully!',
			});
		}

		// Add new collaborator
		await Collaboration.addUserToProject(projectId, user.id, role);
		// 🆕 Send new collaborator notification
		await createNotification({
			project: 'taskmanager',
			notifierId: userId,
			notifiedId: user.id,
			description: `You have been added as a <strong>${role}</strong> to project <strong>${project.name}</strong>.`,
			link: `/taskmanager/${projectId}`,
		});
		req.flash('success', 'User added to project successfully!');
		res.status(201).json({
			success: 'User added to project successfully!',
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Remove a collaborator
export const removeCollaborator = async (req, res) => {
	try {
		const { userId, projectId } = req.params;

		await Collaboration.removeUserFromProject(projectId, userId);
		req.flash('success', 'Collaborator removed successfully!');
		res.status(200).json({ message: 'Collaborator removed successfully' });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Get all collaborators
export const getCollaborators = async (req, res) => {
	try {
		const { projectId } = req.params;
		const collaborators = await Collaboration.getProjectCollaborators(
			projectId
		);

		if (collaborators.length === 0) {
			req.flash('warning', 'No collaborators found.');
		}

		res.status(200).json({ collaborators });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
