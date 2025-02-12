//! routes/followsRoutes.js

import express from 'express';
import {
	blockFollow,
	unfollowFollow,
	unfollowBothFollow,
} from '../controllers/followsController.js';

const router = express.Router();

router.post('/block/:id', blockFollow);
router.post('/unfollow/:id', unfollowFollow);
router.post('/unfollowBoth/:id', unfollowBothFollow);

export default router;
