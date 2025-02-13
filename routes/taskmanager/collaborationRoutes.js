//! routes/taskmanager/collaborationRoutes.js

import express from 'express';
import {
	addCollaborator,
	removeCollaborator,
	getCollaborators,
} from '../../controllers/taskmanager/collaborationsController.js';

const router = express.Router();

// Add a user to a project
router.post('/add', addCollaborator);

// Remove a user from a project
router.delete('/remove/:userId/:projectId', removeCollaborator);

// Get all collaborators for a project
router.get('/:projectId', getCollaborators);

export default router;
