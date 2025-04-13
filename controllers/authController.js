//! controllers/authController.js

import bcrypt from 'bcrypt';

import passport from '../config/passport.js';
import User from '../models/User.js';
import {
	handleRegistration,
	handleExistingUser,
} from '../utils/registerHelper.js';
import {
	validateAndFindUser,
	resendConfirmationEmail,
} from '../utils/resendHelper.js';
import { generateToken, sendEmail } from '../utils/authUtilHelper.js';

// Handle local login
export const login = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/?auth=true', // Redirect with query parameter to trigger modal
	failureFlash: true, // Enable flash messages for errors
});

// Handle local registration
export const register = async (req, res, next) => {
	try {
		const { username, email, password, confirmPassword } = req.body;

		// Basic validation
		if (password !== confirmPassword) {
			req.flash('error', 'Passwords do not match.');
			return res.redirect('/?auth=true');
		}

		// Check if the email or username already exists
		const existingUser =
			(await User.findByEmail(email)) ||
			(await User.findByUsername(username));
		if (existingUser) {
			return handleExistingUser(existingUser, req, res);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		await User.create({
			username,
			email,
			hashedPassword,
		});

		// Get the user by email
		const user = await User.findByEmail(email);

		// Handle registration and send confirmation email
		await handleRegistration(user, req.headers.host);

		req.flash(
			'success',
			'Registration successful. Please check your email to confirm your account.'
		);
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error during registration:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
		next(error);
	}
};

// Handle Google OAuth
export const googleLogin = passport.authenticate('google', {
	scope: ['profile', 'email'],
});

export const googleCallback = async (req, res, next) => {
	try {
		passport.authenticate('google', async (err, user, info) => {
			if (err || !user) {
				req.flash('error', 'Failed to log in using Google.');
				return res.redirect('/?auth=true');
			}

			req.logIn(user, (err) => {
				if (err) {
					console.error('Error during Google login:', err);
					req.flash(
						'error',
						'Something went wrong. Please try again.'
					);
					return res.redirect('/?auth=true');
				}
				res.redirect('/');
			});
		})(req, res, next);
	} catch (error) {
		console.error('Error during Google OAuth callback:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
	}
};

// Handle GitHub OAuth
export const githubLogin = passport.authenticate('github', {
	scope: ['user:email'],
});

export const githubCallback = async (req, res, next) => {
	try {
		passport.authenticate('github', async (err, user, info) => {
			if (err || !user) {
				req.flash('error', 'Failed to log in using GitHub.');
				return res.redirect('/?auth=true');
			}

			req.logIn(user, async (err) => {
				if (err) {
					console.error('Error during GitHub login:', err);
					req.flash(
						'error',
						'Something went wrong. Please try again.'
					);
					return res.redirect('/?auth=true');
				}

				const existingUser = await User.findByEmail(user.email);
				if (existingUser && !existingUser.github_id) {
					await User.updateGitHubId(existingUser.id, user.github_id);
					req.flash(
						'success',
						'GitHub account successfully linked to your existing account.'
					);
				}

				res.redirect('/');
			});
		})(req, res, next);
	} catch (error) {
		console.error('Error during GitHub OAuth callback:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
	}
};

// Handle logout
export const logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			console.error('Error during logout:', err);
			req.flash('error', 'Error during logout.');
			return next(err);
		}

		req.flash('success', 'Logged out successfully.');
		res.redirect('/');
	});
};

// Handle Confrim Email
export const confirmEmail = async (req, res) => {
	try {
		const { token } = req.query;

		const user = await User.findByToken(token);
		if (!user || user.token_expiry < new Date()) {
			req.flash('error', 'Invalid or expired token.');
			return res.redirect('/?auth=true');
		}

		await User.confirmEmail(user.id);
		req.flash(
			'success',
			'Email confirmed successfully! You can now log in.'
		);
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error during email confirmation:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
	}
};

export const resendConfirmation = async (req, res) => {
	try {
		const { email } = req.body;
		const message =
			'If this email is registered and not confirmed, we have resent a confirmation email.';

		// Validate email and find user
		const user = await validateAndFindUser(message, email, req, res);
		if (!user) return; // Redirects handled in helper

		// Check if user is already confirmed
		if (user.confirmed) {
			req.flash('success', message);
			return res.redirect('/?auth=true');
		}

		// Resend confirmation email
		await resendConfirmationEmail(user, req.headers.host);

		req.flash('success', message);
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error resending confirmation email:', error);
		req.flash('error', 'Something went wrong. Please try again later.');
		res.redirect('/?auth=true');
	}
};

export const requestResetPassword = async (req, res) => {
	const message =
		'If this email is registered, we have sent a password reset link.';
	try {
		const { email } = req.body;

		// Validate email and find user
		const user = await validateAndFindUser(message, email, req, res);

		if (!user) {
			req.flash('success', message);
			return res.redirect('/?auth=true');
		}

		// Generate token and save it
		const { token, tokenExpiry } = generateToken();
		await User.updateToken(user.id, token, tokenExpiry);

		// Send reset email
		const resetUrl = `https://${req.headers.host}/auth/reset-password/${token}`;
		const emailContent = `
            <h1>Reset Your Password</h1>
            <p>Please click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
        `;
		await sendEmail(user.email, 'Reset Your Password', emailContent);

		req.flash('success', message);
		res.redirect('/');
	} catch (error) {
		console.error('Error requesting password reset:', error);
		req.flash('error', 'Something went wrong. Please try again later.');
		res.redirect('/?auth=true');
	}
};

export const renderResetPasswordForm = async (req, res) => {
	const { token } = req.params;

	try {
		const user = await User.findByToken(token);

		if (!user || new Date() > new Date(user.token_expiry)) {
			req.flash('error', 'Invalid or expired reset token.');
			return res.redirect('/?auth=true');
		}

		res.redirect(`/?reset=true&token=${token}`);
	} catch (error) {
		console.error('Error rendering reset password form:', error);
		req.flash('error', 'Something went wrong. Please try again later.');
	}
};

export const processResetPassword = async (req, res) => {
	const { token } = req.params;
	const { password, confirmPassword } = req.body;

	try {
		if (password !== confirmPassword) {
			req.flash('error', 'Passwords do not match.');
			return res.redirect(`/auth/reset-password/${token}`);
		}

		const user = await User.findByToken(token);

		if (!user || new Date() > new Date(user.token_expiry)) {
			req.flash('error', 'Invalid or expired reset token.');
			return res.redirect('/?auth=true');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await User.resetPassword(user.id, hashedPassword);

		req.flash(
			'success',
			'Your password has been reset successfully. Please log in.'
		);
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error processing password reset:', error);
		req.flash('error', 'Something went wrong. Please try again later.');
		res.redirect('/?auth=true');
	}
};
