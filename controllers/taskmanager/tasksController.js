//! controllers/taskmanager/taskController.js

import errorHandler from '../../middlewares/errorHandler.js';
import Task from '../../models/Task.js';
import Collaboration from '../../models/Collaboration.js';
import Project from '../../models/Project.js';
import { createNotification } from '../../utils/notificationHelper.js';
import { getTaskDue } from '../../utils/reminderHelper.js';
import {
	resolveAssignedUser,
	handleDueReminderIfNeeded,
} from '../../utils/taskHelper.js';

const priority_color = {
	low: '🟢',
	medium: '🟡',
	high: '🔴',
};
const errorAssignMessage = 'You can only assign tasks to editors or the owner.';

// Create a new task
export const createTask = async (req, res, next) => {
	try {
		const { projectId, name, priority, assignedTo, dueDate } = req.body;

		const assigned_to = await resolveAssignedUser(
			projectId,
			assignedTo,
			req.user.id
		);
		if (!assigned_to) {
			return res.status(403).json({ error: errorAssignMessage });
		}

		const taskId = await Task.createTask(
			projectId,
			name,
			priority,
			assigned_to,
			dueDate
		);

		if (assigned_to !== req.user.id) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: assigned_to,
				description: `You have been assigned a new task ${priority_color[priority]}<strong>${name}</strong>.`,
				link: `/taskmanager/${projectId}`,
			});
		}

		await handleDueReminderIfNeeded(projectId, taskId, dueDate);

		req.flash('success', 'Task created successfully!');
		res.status(200).json({ reload: true });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

// Update a task
export const updateTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const { name, priority, assignedTo, dueDate } = req.body;

		if (!['low', 'medium', 'high'].includes(priority)) {
			return res
				.status(400)
				.json({ error: 'Please set a valid priority value.' });
		}

		const task = await Task.getTaskById(taskId);
		const originalDueStatus = getTaskDue(task.due_date);
		if (originalDueStatus === 'overdue') {
			return res.status(403).json({
				error: 'The task is over due. Please ask the owner to update.',
			});
		}

		const projectId = task?.project_id;
		const assigned_to = await resolveAssignedUser(
			projectId,
			assignedTo,
			req.user.id
		);
		if (!assigned_to) {
			return res.status(403).json({ error: errorAssignMessage });
		}

		await Task.updateTask(taskId, { name, priority, assigned_to, dueDate });

		if (assigned_to && assigned_to !== req.user.id) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: assigned_to,
				description: `${priority_color[priority]} The task <strong>${task.name}</strong> has been updated.`,
				link: `/taskmanager/${projectId}`,
			});
		}

		await handleDueReminderIfNeeded(projectId, taskId, dueDate);

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

		const task = await Task.getTaskById(taskId);
		const originalDueStatus = getTaskDue(task.due_date);
		if (originalDueStatus === 'overdue') {
			return res.status(403).json({
				error: 'The task is over due. Please ask the owner to update status.',
			});
		}

		if (task.status === status) {
			return res
				.status(400)
				.json({ error: 'Task already in this status.' });
		}
		const collaborators = await Collaboration.getProjectCollaborators(
			task.project_id
		);
		const project = await Project.getProjectById(task.project_id);
		await Task.updateValueForATask(taskId, 'status', status);

		collaborators.push({ user_id: project.owner_id });

		for (const collab of collaborators) {
			if (collab.user_id !== req.user.id) {
				await createNotification({
					project: 'taskmanager',
					notifierId: req.user.id,
					notifiedId: collab.user_id,
					description: `<strong>${
						req.user.username
					}</strong> updated the task ${
						priority_color[task.priority]
					}<strong>${task.name}</strong> from ${task.status.replace(
						'_',
						' '
					)} to <strong>${status.replace('_', ' ')}</strong>.`,
					link: `/taskmanager/${task.project_id}`,
				});
			}
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
		const originalDueStatus = getTaskDue(task.due_date);
		if (originalDueStatus === 'overdue') {
			return res.status(403).json({
				error: 'The task is over due. Please ask the owner to delete.',
			});
		}
		const project = await Project.getProjectById(task.project_id);

		await Task.deleteTask(taskId);

		if (req.user.id !== project.owner_id) {
			await createNotification({
				project: 'taskmanager',
				notifierId: req.user.id,
				notifiedId: project.owner_id,
				description: `<strong>${
					req.user.username
				}</strong> deleted the task ${
					priority_color[task.priority]
				}<strong>${
					task.name
				}</strong> (status: <strong>${task.status.replace(
					'_',
					' '
				)}</strong>)`,
				link: `/taskmanager/${task.project_id}`,
			});
		}

		req.flash('success', 'Task deleted successfully!');
		res.status(200).json({ reload: true });
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};
