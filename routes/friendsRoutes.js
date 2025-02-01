//! routes/friendsRoutes.js

import express from 'express';
import { addFriend } from '../controllers/friendsController.js';

const router = express.Router();

// Handle friend request submission
router.post('/add', addFriend);

export default router;
