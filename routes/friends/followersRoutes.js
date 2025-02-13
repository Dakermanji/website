//! routes/friends/followersRoutes.js

import express from 'express';
import {
	blockFollower,
	followBackFollower,
	unfollowBothFollower,
} from '../../controllers/friends/followersController.js';

const router = express.Router();

router.post('/followBack/:id', followBackFollower);
router.post('/block/:id', blockFollower);
router.post('/unfollowBoth/:id', unfollowBothFollower);

export default router;
