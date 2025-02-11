//! routes/followNotifications.js

import express from 'express';
import {
	acceptFollowNotification,
	deleteFollowNotification,
	acceptAndFollowBackFollowNotification,
} from '../controllers/followNotificationsController.js';

const router = express.Router();

router.post('/accept/:id', acceptFollowNotification);
router.post('/acceptAndFollow/:id', acceptAndFollowBackFollowNotification);
router.delete('/remove/:id', deleteFollowNotification);

export default router;
