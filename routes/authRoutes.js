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
	confirmEmail,
} from '../controllers/authController.js';
import {
	sanitizeLoginForm,
	sanitizeRegisterForm,
} from '../middlewares/sanitizeForm.js';

const router = express.Router();

// Local authentication
router.post('/login', sanitizeLoginForm, login);
router.post('/register', sanitizeRegisterForm, register);

// Google OAuth
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// GitHub OAuth
router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);

// Logout
router.get('/logout', logout);

// Confirm-email
router.get('/confirm-email', confirmEmail);

export default router;
