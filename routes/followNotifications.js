//! routes/followNotifications.js

import express from 'express';
import {
	acceptFollowNotification,
	deleteFollowNotification,
	acceptAndFollowBackFollowNotification,
	blockFollowNotification,
	unfollowFollowNotification,
	unfollowBothFollowNotification,
} from '../controllers/followNotificationsController.js';

const router = express.Router();

router.post('/accept/:id', acceptFollowNotification);
router.post('/acceptAndFollow/:id', acceptAndFollowBackFollowNotification);
router.post('/block/:id', blockFollowNotification);
router.post('/unfollow/:id', unfollowFollowNotification);
router.post('/unfollowBoth/:id', unfollowBothFollowNotification);
router.delete('/remove/:id', deleteFollowNotification);

export default router;
