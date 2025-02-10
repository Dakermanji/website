//! routes/followNotifications.js

import express from 'express';
import {
	acceptFollowNotification,
	deleteFollowNotification,
} from '../controllers/followNotificationsController.js';

const router = express.Router();

router.post('/accept/:id', acceptFollowNotification);
router.delete('/remove/:id', deleteFollowNotification);

export default router;
