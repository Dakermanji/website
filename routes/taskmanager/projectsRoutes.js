//! routes/taskmanager/projectsRoutes.js

import express from 'express';
import {
	createProject,
	getProjects,
	deleteProject,
	getBoard,
} from '../../controllers/taskmanager/projectsController.js';
import { checkProjectAccess } from '../../middlewares/taskmanagerMiddleware.js';

const router = express.Router();

// Create a new project
router.post('/create', createProject);

// Get all projects for the logged-in user
router.get('/', getProjects); // Project list

// Get a certain project
router.get('/:id', checkProjectAccess('viewer'), getBoard); // Task Board

// Delete a project
router.delete('/:id', checkProjectAccess('owner'), deleteProject);

export default router;
