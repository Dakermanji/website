//! controllers/taskmanager/taskController.js

import Task from '../../models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
	try {
		const { projectId, name, assignedTo, dueDate } = req.body;
		const task = await Task.createTask(
			projectId,
			name,
			assignedTo,
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
