//! routes/taskmanager/tasksRoutes.js

import express from 'express';
import { ensureAuthenticated } from '../../middlewares/authMiddleware.js';
import { checkProjectAccess } from '../../middlewares/taskmanagerMiddleware.js';
import {
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
} from '../../controllers/taskmanager/tasksController.js';

const router = express.Router();

// Create a new task in a project
router.post(
	'/create',
	ensureAuthenticated,
	checkProjectAccess('editor'),
	createTask
);

// Update a task's status, name, or assignment
router.put(
	'/:taskId',
	ensureAuthenticated,
	checkProjectAccess('editor'),
	updateTaskStatus
);
router.put(
	'/update/:taskId',
	ensureAuthenticated,
	checkProjectAccess('editor'),
	updateTask
);

// Delete a task
router.delete(
	'/:taskId',
	ensureAuthenticated,
	checkProjectAccess('eidtor'),
	deleteTask
);

export default router;
