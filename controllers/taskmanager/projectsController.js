//! controllers/taskmanager/projectsController.js

import Project from '../../models/Project.js';
import Task from '../../models/Task.js';
import Collaboration from '../../models/Collaboration.js';
import User from '../../models/User.js';
import { navBar } from '../../data/navBar.js';

// Create a new project
export const createProject = async (req, res) => {
	try {
		const { name } = req.body;
		const ownerId = req.user.id;

		const project = await Project.createProject(name, ownerId);
		req.flash('success', 'Project created successfully!');
		res.status(201).json({ project });
	} catch (error) {
		req.flash('error', 'Error creating project.');
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
			success_msg: res.locals.success,
			error_msg: res.locals.error,
		});
	} catch (error) {
		req.flash('error', 'Error loading projects.');
		res.redirect('/projects'); // Redirect to a safe page
	}
};

// Delete a project
export const deleteProject = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const project = await Project.getProjectById(id);
		if (!project) {
			req.flash('error', 'Project not found.');
			return res.status(404).json({ error: 'Project not found' });
		}
		if (project.owner_id !== userId) {
			req.flash(
				'error',
				'Only the project owner can delete this project.'
			);
			return res.status(403).json({ error: 'Unauthorized' });
		}

		await Task.deleteTasksByProjectId(id);
		await Collaboration.removeAllByProjectId(id);
		await Project.deleteProject(id);

		req.flash('success', 'Project deleted successfully!');
		res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		req.flash('error', 'Error deleting project.');
		res.status(500).json({ error: 'Error deleting project' });
	}
};

export const getBoard = async (req, res) => {
	try {
		if (!req.user) {
			req.flash('error', 'Please log in to access projects.');
			return res.redirect('/?auth=true');
		}

		const { id } = req.params;
		const userId = req.user.id;

		const project = await Project.getProjectById(id);
		if (!project) {
			req.flash('error', 'Project not found.');
			return res.redirect('/taskmanager/projects');
		}

		const isOwner = project.owner_id === userId;
		const collaborators = await Collaboration.getProjectCollaborators(id);
		const userCollab = collaborators.find((collab) => collab.id === userId);

		const owner = await User.findById(project.owner_id);

		if (!isOwner && !userCollab) {
			req.flash(
				'error',
				'Access denied: You are not part of this project.'
			);
			return res.redirect('/taskmanager/projects');
		}

		const tasks = await Task.getTasksByProjectId(id);
		res.render('taskmanager/board', {
			title: `${project.name} - Kanban Board`,
			project,
			navBar: navBar.index,
			tasks,
			owner,
			collaborators,
			userRole: isOwner ? 'owner' : userCollab?.role,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
			scripts: ['helpers/modalHelper', 'taskmanager'],
			styles: ['taskmanager/modals', 'taskmanager/tasks'],
		});
	} catch (error) {
		req.flash('error', 'Error fetching project board.');
		res.redirect('/taskmanager/projects');
	}
};
