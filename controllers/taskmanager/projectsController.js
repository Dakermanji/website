//! controllers/taskmanager/projectsController.js

import Project from '../../models/Project.js';
import Task from '../../models/Task.js';
import Collaboration from '../../models/Collaboration.js';
import { navBar } from '../../data/navBar.js';

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
		res.render('taskmanager/index', {
			title: 'Task Manager - DWD',
			projects,
			navBar: navBar.index,
			scripts: ['helpers/modalHelper', 'taskmanager'],
			styles: ['taskmanager/modals'],
		});
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

export const getBoard = async (req, res) => {
	try {
		const { id } = req.params;
		const project = await Project.getProjectById(id);
		const tasks = await Task.getTasksByProjectId(id);
		const collaborators = await Collaboration.getProjectCollaborators(id);

		if (!project) {
			return res.status(404).json({ error: 'Project not found' });
		}

		res.render('taskmanager/board', {
			title: `${project.name} - Kanban Board`,
			project,
			tasks,
			navBar: navBar.index,
			collaborators,
			scripts: ['helpers/modalHelper', 'taskmanager'],
			styles: ['taskmanager/modals', 'taskmanager/tasks'],
		});
	} catch (error) {
		res.status(500).json({ error: 'Error fetching project board' });
	}
};
