//! routes/taskmanager/tasksRoutes.js

import express from 'express';
import {
	createTask,
	updateTask,
	deleteTask,
} from '../../controllers/taskmanager/tasksController.js';

const router = express.Router();

// Create a new task in a project
router.post('/create', createTask);

// Update a task's status, name, or assignment
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

export default router;
