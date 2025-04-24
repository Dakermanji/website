//! utils/notificationHelper.js

import Notification from '../models/Notification.js';

/**
 * Create and store a notification.
 * @param {Object} options
 * @param {string} options.project - Project name (e.g., 'taskmanager')
 * @param {string} options.notifierId - User ID who triggered the action
 * @param {string} options.notifiedId - User ID who receives the notification
 * @param {string} options.description - Notification message
 */
export const createNotification = async ({
	project,
	notifierId = null,
	notifiedId,
	description,
	link = null,
}) => {
	if (!project || !notifiedId || !description) {
		throw new Error('Missing required fields to create a notification');
	}

	try {
		await Notification.create({
			project,
			notifier_id: notifierId,
			notified_id: notifiedId,
			description,
			link,
		});
	} catch (error) {
		console.error('Failed to create notification:', error);
		Sentry.captureException(error);
	}
};
