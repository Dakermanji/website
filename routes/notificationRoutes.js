//! routes/notificationRoutes.js

import express from 'express';
import {
	markAllAsRead,
	markAndRedirect,
} from '../controllers/notificationsController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/read/:notificationId', ensureAuthenticated, markAndRedirect);
router.post('/mark-all-read', ensureAuthenticated, markAllAsRead);

export default router;
