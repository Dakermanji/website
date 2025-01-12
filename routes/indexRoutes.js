//! routes/indexRoutes.js

import express from 'express';
import { getIndex, postMessage } from '../controllers/indexController.js';

const router = express.Router();

// Home page route
router.get('/', getIndex);

// Send message route
router.post('/send-message', postMessage);

export default router;
