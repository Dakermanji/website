//! routes/projectsRoutes.js

import express from 'express';
import { renderProjects } from '../controllers/projectsController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to render the projects page
router.get('/', ensureAuthenticated, renderProjects);

export default router;
