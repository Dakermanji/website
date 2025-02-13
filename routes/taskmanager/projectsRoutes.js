//! routes/taskmanager/projectsRoutes.js

import express from 'express';
import {
	createProject,
	getProjects,
	deleteProject,
} from '../../controllers/taskmanager/projectsController.js';

const router = express.Router();

// Create a new project
router.post('/create', createProject);

// Get all projects for the logged-in user
router.get('/', getProjects);

// Delete a project
router.delete('/:id', deleteProject);

export default router;
