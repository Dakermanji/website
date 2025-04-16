//! routes/taskmanager/tasksRoutes.js

import express from 'express';
import { isEditor } from '../../middlewares/taskmanagerMiddleware.js';
import {
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
} from '../../controllers/taskmanager/tasksController.js';

const router = express.Router();

// Create a new task in a project
router.post('/create', isEditor, createTask);

// Update a task's status, name, or assignment
router.put('/:taskId', isEditor, updateTaskStatus);
router.put('/update/:taskId', isEditor, updateTask);

// Delete a task
router.delete('/:taskId', isEditor, deleteTask);

export default router;
