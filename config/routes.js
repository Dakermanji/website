//! config/routes.js
import express from 'express';

import indexRouter from '../routes/indexRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import projectsRoutes from '../routes/projectsRoutes.js';

const router = express.Router();

// Step 1: Apply global middlewares

// Step 2: Define application routes
// Base routes are mounted here, linking to their respective route handlers
router.use('/', indexRouter);
router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);

// Step 3: Handle 404 errors
// Catch-all route for unmatched paths
router.use((req, res, next) => {
	const error = new Error('Page Not Found');
	error.status = 404;

	if (process.env.NODE_ENV === 'development') {
		console.error(`[404 Error]: ${req.originalUrl}`);
	}

	next(error); // Forward error to the global error handler
});

export default router;
