//! controllers/taskmanager/collaborationController.js

import Collaboration from '../../models/Collaboration.js';
import User from '../../models/User.js';
import Project from '../../models/Project.js';

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
			// Update the role if already a collaborator
			await Collaboration.updateUserRole(projectId, user.id, role);
			req.flash('success', 'User role updated successfully!');
			return res.status(200).json({
				success: 'User role updated successfully!',
			});
		}

		// Add new collaborator
		await Collaboration.addUserToProject(projectId, user.id, role);
		req.flash('success', 'User added to project successfully!');
		res.status(201).json({
			success: 'User added to project successfully!',
		});
	} catch (error) {
		console.error('Error adding collaborator:', error);
		req.flash('error', 'Error adding collaborator.');
		res.status(500).json({ error: 'Error adding collaborator' });
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
		req.flash('error', 'Error removing collaborator.');
		res.status(500).json({ error: 'Error removing collaborator' });
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
		req.flash('error', 'Error fetching collaborators.');
		res.status(500).json({ error: 'Error fetching collaborators' });
	}
};
