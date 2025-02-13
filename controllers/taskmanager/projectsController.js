//! controllers/taskmanager/projectsController.js
import Project from '../../models/Project.js';

// Create a new project
export const createProject = async (req, res) => {
	try {
		const { name } = req.body;
		const ownerId = req.user.id;

		const project = await Project.createProject(name, ownerId);
		res.status(201).json({
			message: 'Project created successfully',
			project,
		});
	} catch (error) {
		res.status(500).json({ error: 'Error creating project' });
	}
};

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
	try {
		const ownerId = req.user.id;
		const projects = await Project.getProjectsByOwner(ownerId);
		res.status(200).json({ projects });
	} catch (error) {
		res.status(500).json({ error: 'Error fetching projects' });
	}
};

// Delete a project
export const deleteProject = async (req, res) => {
	try {
		const { id } = req.params;
		await Project.deleteProject(id);
		res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Error deleting project' });
	}
};
