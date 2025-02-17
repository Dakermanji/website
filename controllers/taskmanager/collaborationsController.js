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
		if (!project || project.owner_id !== userId) {
			req.flash('error', 'Only the project owner can add collaborators.');
			return res.status(403).json({
				error: 'Only the project owner can add collaborators.',
			});
		}

		const user = await User.findByEmail(email);
		if (!user) {
			req.flash('error', 'User not found.');
			return res.status(404).json({ error: 'User not found.' });
		}

		await Collaboration.addUserToProject(projectId, user.id, role);
		req.flash('success', 'User added to project successfully!');
		res.status(201).json({
			success: 'User added to project successfully!',
		});
	} catch (error) {
		req.flash('error', 'Error adding collaborator.');
		res.status(500).json({ error: 'Error adding collaborator' });
	}
};

// Remove a collaborator
export const removeCollaborator = async (req, res) => {
	try {
		const { userId, projectId } = req.params;
		const ownerId = req.user.id;

		const project = await Project.getProjectById(projectId);
		if (!project || project.owner_id !== ownerId) {
			req.flash(
				'error',
				'Only the project owner can remove collaborators.'
			);
			return res.status(403).json({ error: 'Unauthorized' });
		}

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
