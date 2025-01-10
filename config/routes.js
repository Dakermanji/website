//! config/routes.js
import express from 'express';

import indexRouter from '../routes/indexRoutes.js';

const router = express.Router();

// Step 1: Apply global middlewares

// Step 2: Define application routes
// Base routes are mounted here, linking to their respective route handlers
router.use('/', indexRouter);

// Step 3: Handle 404 errors
// Catch-all route for unmatched paths

export default router;
