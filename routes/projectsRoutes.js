//! routes/projectsRoutes.js

import express from 'express';
import { renderProjects } from '../controllers/projectsController.js';

const router = express.Router();

// Route to render the projects page
router.get('/', renderProjects);

export default router;
