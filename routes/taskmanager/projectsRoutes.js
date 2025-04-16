//! routes/taskmanager/projectsRoutes.js

import express from 'express';
import { isOwner, isViewer } from '../../middlewares/taskmanagerMiddleware.js';
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
router.get('/', getProjects); // Project list

// Get a certain project
router.get('/:projectId', isViewer, getBoard); // Task Board

// Delete a project
router.delete('/:projectId', isOwner, deleteProject);

export default router;
