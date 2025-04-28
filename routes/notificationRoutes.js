//! routes/notificationRoutes.js

import express from 'express';
import {
	markAllAsRead,
	markAndRedirect,
} from '../controllers/notificationsController.js';

const router = express.Router();

router.get('/read/:notificationId', markAndRedirect);
router.post('/mark-all-read', markAllAsRead);

export default router;
