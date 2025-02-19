//! routes/taskmanager/collaborationsRoutes.js

import express from 'express';
import { checkProjectAccess } from '../../middlewares/taskmanagerMiddleware.js';
import {
	addCollaborator,
	removeCollaborator,
	getCollaborators,
} from '../../controllers/taskmanager/collaborationsController.js';

const router = express.Router();

// Add a user to a project
router.post('/add', checkProjectAccess('owner'), addCollaborator);

// Remove a user from a project
router.delete(
	'/remove/:userId/:projectId',
	checkProjectAccess('owner'),
	removeCollaborator
);

// Get all collaborators for a project
router.get('/:projectId', checkProjectAccess('viewer'), getCollaborators);

export default router;
