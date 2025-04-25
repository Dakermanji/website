//! utils/reminderHelper.js

import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { createNotification } from './notificationHelper.js';

const oneHour = 1000 * 60 * 60;

/**
 * Checks task due status and returns:
 * '24hr' | 'overdue' | null
 */
export const getTaskDue = (dueDate) => {
	const now = new Date();
	const due = new Date(dueDate);

	const todayUTC = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
	);
	const dueUTC = new Date(
		Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate())
	);

	if (dueUTC < todayUTC) return 'overdue';
	if (dueUTC.getTime() === todayUTC.getTime()) return '24hr';
	return null;
};

/**
 * Sends reminders for due tasks in bulk (cron job)
 */
export const processDueTaskReminders = async () => {
	const tasks = await Task.getAllPendingWithDueDates();

	for (const task of tasks) {
		const dueStatus = getTaskDue(task.due_date);
		if (!dueStatus) continue;

		const alreadySent =
			(dueStatus === '24hr' && task.reminder_24hr_sent) ||
			(dueStatus === 'overdue' && task.reminder_overdue_sent);

		if (alreadySent) continue;

		const project = await Project.getProjectById(task.project_id);
		await sendDueTaskNotification(dueStatus, project.owner_id, task);
	}
};

/**
 * Sends a due notification to task assignee + owner
 */
export const sendDueTaskNotification = async (
	dueStatus,
	projectOwnerId,
	task
) => {
	const recipientIds = new Set();
	if (task.assigned_to) recipientIds.add(task.assigned_to);
	recipientIds.add(projectOwnerId);

	const icon = dueStatus === '24hr' ? '🔥' : '⛔';
	const text =
		dueStatus === '24hr' ? 'is due in less than 24 hours.' : 'is overdue!';

	for (const userId of recipientIds) {
		await createNotification({
			project: 'taskmanager',
			notifierId: null,
			notifiedId: userId,
			description: `${icon} Task <strong>${task.name}</strong> ${text}`,
			link: `/taskmanager/${task.project_id}`,
		});
	}

	await Task.markReminderSent(task.id, dueStatus);
};
