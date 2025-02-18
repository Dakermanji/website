//! controllers/taskmanager/taskController.js

import Task from '../../models/Task.js';
import User from '../../models/User.js';

// Create a new task
export const createTask = async (req, res) => {
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

		const task = await Task.createTask(
			projectId,
			name,
			assigned_to,
			dueDate
		);
		req.flash('success', 'Task created successfully!');
		res.status(201).json({ success: 'Task created successfully!', task });
	} catch (error) {
		req.flash('error', 'Error creating task.');
		res.status(500).json({ error: 'Error creating task' });
	}
};

// Update a task
export const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, assignedTo, dueDate } = req.body;

		let assigned_to = assignedTo
			? (await User.findByEmail(assignedTo))?.id
			: null;

		if (assignedTo && !assigned_to) {
			req.flash('error', 'No user found with this email.');
			return res
				.status(404)
				.json({ error: 'No user found with this email.' });
		}

		await Task.updateTask(id, { name, assigned_to, dueDate });
		req.flash('success', 'Task updated successfully!');
		res.status(200).json({ message: 'Task updated successfully' });
	} catch (error) {
		req.flash('error', 'Error updating task.');
		res.status(500).json({ error: 'Error updating task' });
	}
};

export const updateTaskStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!['todo', 'in_progress', 'done'].includes(status)) {
			req.flash('error', 'Invalid task status.');
			return res.status(400).json({ error: 'Invalid task status' });
		}

		await Task.updateValueForATask(id, 'status', status);
		req.flash('success', 'Task status updated successfully!');
		res.status(200).json({
			message: 'Task status updated successfully',
			taskId: id,
			newStatus: status,
		});
	} catch (error) {
		req.flash('error', 'Error updating task status.');
		res.status(500).json({ error: 'Error updating task status' });
	}
};

// Delete a task
export const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		await Task.deleteTask(id);
		req.flash('success', 'Task deleted successfully!');
		res.status(200).json({ message: 'Task deleted successfully' });
	} catch (error) {
		req.flash('error', 'Error deleting task.');
		res.status(500).json({ error: 'Error deleting task' });
	}
};
