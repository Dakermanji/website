//! controllers/taskmanager/collaborationController.js

import Collaboration from '../../models/Collaboration.js';
import User from '../../models/User.js';

// Add a collaborator to a project
export const addCollaborator = async (req, res) => {
	try {
		const { projectId, email, role } = req.body;

		// Find user by email
		const user = await User.findByEmail(email);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Add user as collaborator
		await Collaboration.addUserToProject(projectId, user.id, role);
		res.status(201).json({ message: 'User added to project successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Error adding collaborator' });
	}
};

// Remove a collaborator
export const removeCollaborator = async (req, res) => {
	try {
		const { userId, projectId } = req.params;
		await Collaboration.removeUserFromProject(projectId, userId);
		res.status(200).json({ message: 'Collaborator removed successfully' });
	} catch (error) {
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
		res.status(200).json({ collaborators });
	} catch (error) {
		res.status(500).json({ error: 'Error fetching collaborators' });
	}
};
