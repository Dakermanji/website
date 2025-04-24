//! cron/reminderJob.js
import * as Sentry from '@sentry/node';

import cron from 'node-cron';
import { processDueTaskReminders } from '../utils/reminderHelper.js';

// Schedule the reminder job to run hourly at minute 0
cron.schedule('0 * * * *', async () => {
	try {
		console.log('[🔔 ReminderJob] Running hourly check...');
		await processDueTaskReminders();
		console.log('[✅ ReminderJob] Task reminders processed.');
	} catch (error) {
		console.error(
			'[❌ ReminderJob] Failed to process task reminders:',
			error
		);

		// 🔔 Send to Sentry
		Sentry.captureException(error, {
			level: 'error',
			tags: { job: 'reminder', type: 'cron' },
			extra: {
				message: 'Failed during task reminder processing',
				timestamp: new Date().toISOString(),
			},
		});
	}
});
