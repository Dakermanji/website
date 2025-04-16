//! routes/taskmanager/collaborationsRoutes.js

import express from 'express';
import {
	isOwner,
	isEditor,
	isViewer,
} from '../../middlewares/taskmanagerMiddleware.js';
import {
	addCollaborator,
	removeCollaborator,
	getCollaborators,
} from '../../controllers/taskmanager/collaborationsController.js';

const router = express.Router();

// Add a user to a project
router.post('/add', isOwner, addCollaborator);

// Remove a user from a project
router.delete('/remove/:userId/:projectId', isOwner, removeCollaborator);

// Get all collaborators for a project
router.get('/:projectId', isViewer, getCollaborators);

export default router;
