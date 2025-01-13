//! routes/indexRoutes.js
import { sanitizeForm } from '../middlewares/sanitizeForm.js';

import express from 'express';
import { getIndex, postMessage } from '../controllers/indexController.js';

const router = express.Router();

// Home page route
router.get('/', getIndex);

// Send message route
router.post('/send-message', sanitizeForm, postMessage);

export default router;
