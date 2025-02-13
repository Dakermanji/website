//! routes/friends/friendsRoutes.js

import express from 'express';
import { addFriend } from '../../controllers/friends/friendsController.js';

const router = express.Router();

// Handle friend request submission
router.post('/add', addFriend);

export default router;
