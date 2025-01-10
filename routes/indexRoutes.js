//! routes/indexRoutes.js

import express from 'express';
import { getIndex } from '../controllers/indexController.js';

const router = express.Router();

router.get('/', getIndex);

export default router;
