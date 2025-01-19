//! routes/indexRoutes.js

import { sanitizeMessageForm } from '../middlewares/sanitizeForm.js';

import express from 'express';
import { getIndex, postMessage } from '../controllers/indexController.js';

const router = express.Router();

// Home page route
router.get('/', getIndex);

// Send message route
router.post('/send-message', sanitizeMessageForm, postMessage);

export default router;
