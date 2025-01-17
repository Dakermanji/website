//! routes/authRoutes.js

import express from 'express';
import {
	login,
	register,
	googleLogin,
	googleCallback,
	githubLogin,
	githubCallback,
	logout,
} from '../controllers/authController.js';

const router = express.Router();

// Local authentication
router.post('/login', login);
router.post('/register', register);

// Google OAuth
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// GitHub OAuth
router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);

// Logout
router.get('/logout', logout);

export default router;
