//! routes/taskmanager/projectsRoutes.js

import express from 'express';
import { ensureAuthenticated } from '../../middlewares/authMiddleware.js';
import { checkProjectAccess } from '../../middlewares/taskmanagerMiddleware.js';
import {
	createProject,
	getProjects,
	deleteProject,
	getBoard,
} from '../../controllers/taskmanager/projectsController.js';

const router = express.Router();

// Create a new project
router.post('/create', createProject);

// Get all projects for the logged-in user
router.get('/', ensureAuthenticated, getProjects); // Project list

// Get a certain project
router.get(
	'/:projectId',
	ensureAuthenticated,
	checkProjectAccess('viewer'),
	getBoard
); // Task Board

// Delete a project
router.delete(
	'/:projectId',
	ensureAuthenticated,
	checkProjectAccess('owner'),
	deleteProject
);

export default router;
