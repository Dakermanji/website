//! controllers/taskmanager/taskController.js

import errorHandler from '../../middlewares/errorHandler.js';
import Task from '../../models/Task.js';
import User from '../../models/User.js';

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

		await Task.updateTask(taskId, { name, assigned_to, dueDate });
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
		await Task.deleteTask(taskId);
		req.flash('success', 'Task deleted successfully!');
		res.status(200).json({ reload: true });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
