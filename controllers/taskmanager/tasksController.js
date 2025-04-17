//! controllers/taskmanager/taskController.js

import errorHandler from '../../middlewares/errorHandler.js';
import Task from '../../models/Task.js';
import User from '../../models/User.js';
import Collaboration from '../../models/Collaboration.js';
import Project from '../../models/Project.js';
import { createNotification } from '../../utils/notificationHelper.js';

// Create a new task
export const createTask = async (req, res, next) => {
	try {
		const { projectId, name, assignedTo, dueDate } = req.body;

		let assigned_to = assignedTo
			? (await User.findByEmail(assignedTo))?.id
			: req.user.id;

		if (!assigned_to) {
			req.flash('error', 'No user found with this email.');
			return res
				.status(404)
				.json({ error: 'No user found with this email.' });
		}

		await Task.createTask(projectId, name, assigned_to, dueDate);

		if (assigned_to !== req.user.id) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: assigned_to,
				description: `You have been assigned a new task ** ${name} **.`,
				link: `/taskmanager/${projectId}`,
			});
		}

		req.flash('success', 'Task created successfully!');
		res.status(200).json({ reload: true });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Update a task
export const updateTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { name, assignedTo, dueDate } = req.body;

		let assigned_to = assignedTo
			? (await User.findByEmail(assignedTo))?.id
			: null;

		if (assignedTo && !assigned_to) {
			return res
				.status(404)
				.json({ error: 'No user found with this email.' });
		}

		const task = await Task.getTaskById(taskId);
		const projectId = task?.project_id;

		await Task.updateTask(taskId, { name, assigned_to, dueDate });

		if (assigned_to && assigned_to !== req.user.id) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: assigned_to,
				description: `The task ** ${task.name} ** has been updated.`,
				link: `/taskmanager/${projectId}`,
			});
		}

		req.flash('success', 'Task updated successfully!');
		res.status(200).json({ reload: true });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Update a task status
export const updateTaskStatus = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const { status } = req.body;

		if (!['todo', 'in_progress', 'done'].includes(status)) {
			return res.status(400).json({ error: 'Invalid task status' });
		}

		await Task.updateValueForATask(taskId, 'status', status);

		const task = await Task.getTaskById(taskId);
		const collaborators = await Collaboration.getProjectCollaborators(
			task.project_id
		);
		const project = await Project.getProjectById(task.project_id);

		for (const collab of collaborators) {
			if (collab.user_id !== req.user.id) {
				await createNotification({
					project: 'taskmanager',
					notifierId: req.user.id,
					notifiedId: collab.user_id,
					description: `${req.user.display_name} updated the task **${
						task.name
					}** to **${status.replace('_', ' ')}**.`,
					link: `/taskmanager/${task.project_id}`,
				});
			}
		}

		if (
			project.owner_id !== req.user.id &&
			!collaborators.find((c) => c.user_id === project.owner_id)
		) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: project.owner_id,
				description: `${req.user.display_name} updated the task **${
					task.name
				}** to **${status.replace('_', ' ')}**.`,
				link: `/taskmanager/${task.project_id}`,
			});
		}

		res.status(200).json({
			message: 'Task status updated successfully',
			taskId,
			newStatus: status,
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Delete a task
export const deleteTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		const task = await Task.getTaskById(taskId);
		const project = await Project.getProjectById(task.project_id);

		await Task.deleteTask(taskId);

		if (req.user.id !== project.owner_id) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: project.owner_id,
				description: `${req.user.display_name} deleted the task ** ${task.name} ** (status: ** ${task.status} **)`,
				link: `/taskmanager/${task.project_id}`,
			});
		}

		req.flash('success', 'Task deleted successfully!');
		res.status(200).json({ reload: true });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
