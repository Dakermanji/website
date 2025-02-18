//! routes/taskmanager/tasksRoutes.js

import express from 'express';
import {
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
} from '../../controllers/taskmanager/tasksController.js';

const router = express.Router();

// Create a new task in a project
router.post('/create', createTask);

// Update a task's status, name, or assignment
router.put('/:id', updateTaskStatus);
router.put('/update/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

export default router;
