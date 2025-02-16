//! controllers/taskmanager/taskController.js

import Task from '../../models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
	try {
		const { projectId, name, assignedTo, dueDate } = req.body;
		let assigned_to;
		if (!assignedTo) assigned_to = req.user.id;
		const task = await Task.createTask(
			projectId,
			name,
			assigned_to,
			dueDate
		);
		res.status(201).json({ message: 'Task created successfully', task });
	} catch (error) {
		res.status(500).json({ error: 'Error creating task' });
	}
};

// Update a task
export const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, status, assignedTo, dueDate } = req.body;
		await Task.updateTask(id, { name, status, assignedTo, dueDate });
		res.status(200).json({ message: 'Task updated successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Error updating task' });
	}
};

export const updateTaskStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!['todo', 'in_progress', 'done'].includes(status)) {
			return res.status(400).json({ error: 'Invalid task status' });
		}

		await Task.updateValueForATask(id, 'status', status);
		res.status(200).json({
			message: 'Task updated successfully',
			taskId: id,
			newStatus: status,
		});
	} catch (error) {
		console.error('Error updating task:', error);
		res.status(500).json({ error: 'Error updating task' });
	}
};

// Delete a task
export const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		await Task.deleteTask(id);
		res.status(200).json({ message: 'Task deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Error deleting task' });
	}
};
