//! routes/blocksRoutes.js

import express from 'express';
import {
	unblockBlocked,
	unblockAndFollowBlocked,
} from '../controllers/blocksController.js';

const router = express.Router();

router.post('/unblock/:id', unblockBlocked);
router.post('/unblockFollow/:id', unblockAndFollowBlocked);

export default router;
