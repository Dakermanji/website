//! config/routes.js

import express from 'express';

import indexRouter from '../routes/indexRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import projectsRoutes from '../routes/projectsRoutes.js';

// import friends routes
import friendsRoutes from '../routes/friends/friendsRoutes.js';
import followNotificationsRoutes from '../routes/friends/followNotificationsRoutes.js';
import followsRoutes from '../routes/friends/followsRoutes.js';
import followersRoutes from '../routes/friends/followersRoutes.js';
import blocksRoutes from '../routes/friends/blocksRoutes.js';
import notificationRoutes from '../routes/notificationRoutes.js';

// import taskmanager routes
import projectsTMRoutes from '../routes/taskmanager/projectsRoutes.js';
import tasksTMRoutes from '../routes/taskmanager/tasksRoutes.js';
import collaborationsTMRoutes from '../routes/taskmanager/collaborationsRoutes.js';

// import weather routes
import weatherRoutes from '../routes/weatherRoutes.js';

const router = express.Router();

// Step 1: Apply global middlewares

// Step 2: Define application routes
// Base routes are mounted here, linking to their respective route handlers
router.use('/', indexRouter);
router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);

// Friends routes
router.use('/friends', friendsRoutes);
router.use('/followNotifications', followNotificationsRoutes);
router.use('/follows', followsRoutes);
router.use('/followers', followersRoutes);
router.use('/blocks', blocksRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);

// Task Manager routes
router.use('/taskmanager/tasks', tasksTMRoutes);
router.use('/taskmanager/collaborations', collaborationsTMRoutes);
router.use('/taskmanager', projectsTMRoutes);

// Weather routes
router.use('/weather', weatherRoutes);

// Step 3: Handle 404 errors: Catch-all route for unmatched paths
router.use((req, res, next) => {
	const error = new Error('Page Not Found');
	error.status = 404;
	req.flash('error', 'Page Not Found');

	if (req.xhr || req.headers.accept?.includes('json')) {
		// API Requests: Send JSON response
		return res.status(404).json({ error: 'Page Not Found' });
	}

	if (process.env.NODE_ENV === 'development') {
		console.error(`[404 Error]: ${req.originalUrl}`);
	}

	// UI Requests: Redirect and preserve flash messages
	return res.redirect('/');
});

export default router;
