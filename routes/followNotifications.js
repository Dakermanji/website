//! routes/followNotifications.js

import express from 'express';
import { deleteNotification } from '../controllers/followNotificationsController.js';

const router = express.Router();

router.delete('/remove/:id', deleteNotification);

export default router;
