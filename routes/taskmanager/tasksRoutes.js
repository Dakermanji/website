//! routes/taskmanager/tasksRoutes.js

import express from 'express';
import { checkProjectAccess } from '../../middlewares/taskmanagerMiddleware.js';
import {
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
} from '../../controllers/taskmanager/tasksController.js';

const router = express.Router();

// Create a new task in a project
router.post('/create', checkProjectAccess('editor'), createTask);

// Update a task's status, name, or assignment
router.put('/:taskId', checkProjectAccess('editor'), updateTaskStatus);
router.put('/update/:taskId', checkProjectAccess('editor'), updateTask);

// Delete a task
router.delete('/:taskId', checkProjectAccess('eidtor'), deleteTask);

export default router;
