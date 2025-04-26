//! utils/taskHelper.js

import Project from '../models/Project.js';
import User from '../models/User.js';
import Collaboration from '../models/Collaboration.js';
import Task from '../models/Task.js';
import { getTaskDue, sendDueTaskNotification } from './reminderHelper.js';

export const resolveAssignedUser = async (projectId, email, currentUserId) => {
	const assignedUser = email
		? await User.findByEmail(email)
		: await User.findById(currentUserId);

	if (!assignedUser) return null;

	const project = await Project.getProjectById(projectId);
	if (!project) return null;

	let role = null;
	if (assignedUser.id === project.owner_id) {
		role = 'owner';
	} else {
		const collab = await Collaboration.getCollaboration(
			projectId,
			assignedUser.id
		);
		role = collab?.role;
	}

	if (role !== 'editor' && role !== 'owner') return null;

	return assignedUser.id;
};

export const handleDueReminderIfNeeded = async (projectId, taskId, dueDate) => {
	const dueStatus = getTaskDue(dueDate);
	if (!['24hr', 'overdue'].includes(dueStatus)) return;

	const project = await Project.getProjectById(projectId);
	const task = await Task.getTaskById(taskId);

	await sendDueTaskNotification(dueStatus, project.owner_id, task);
};
