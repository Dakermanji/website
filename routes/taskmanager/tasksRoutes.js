//! routes/taskmanager/tasksRoutes.js

import express from 'express';
import {
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
} from '../../controllers/taskmanager/tasksController.js';
import { checkProjectAccess } from '../../middlewares/taskmanagerMiddleware.js';

const router = express.Router();

// Create a new task in a project
router.post('/create', checkProjectAccess('editor'), createTask);

// Update a task's status, name, or assignment
router.put('/:id', checkProjectAccess('editor'), updateTaskStatus);
router.put('/update/:id', checkProjectAccess('editor'), updateTask);

// Delete a task
router.delete('/:id', checkProjectAccess('eidtor'), deleteTask);

export default router;
