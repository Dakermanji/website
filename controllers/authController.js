//! controllers/authController.js

import bcrypt from 'bcrypt';

import passport from '../config/passport.js';
import User from '../models/User.js';
import {
	generateToken,
	sendConfirmationEmail,
	handleExistingUser,
} from '../utils/registerHelper.js';
import {
	validateAndFindUser,
	resendConfirmationEmail,
} from '../utils/resendHelper.js';

// Handle local login
export const login = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/?auth=true', // Redirect with query parameter to trigger modal
	failureFlash: true, // Enable flash messages for errors
});

// Handle local registration
export const register = async (req, res) => {
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

		// Generate hashed password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate token and expiry
		const { token, tokenExpiry } = generateToken();

		// Create the user
		await User.create({
			username,
			email,
			hashedPassword,
			token,
			tokenExpiry,
		});

		// Send confirmation email
		const confirmUrl = `http://${req.headers.host}/auth/confirm-email?token=${token}`;
		await sendConfirmationEmail(email, confirmUrl);

		req.flash(
			'success',
			'Registration successful. Please check your email to confirm your account.'
		);
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error during registration:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
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
export const logout = (req, res) => {
	req.logout((err) => {
		if (err) {
			console.error('Error during logout:', err);
			req.flash('error', 'Error during logout.');
			return res.redirect('/');
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

		// Validate email and find user
		const user = await validateAndFindUser(email, req, res);
		if (!user) return; // Redirects handled in helper

		// Check if user is already confirmed
		if (user.confirmed) {
			req.flash(
				'success',
				'Your account is already confirmed. You can log in.'
			);
			return res.redirect('/?auth=true');
		}

		// Resend confirmation email
		await resendConfirmationEmail(user, req.headers.host);

		req.flash(
			'success',
			'A new confirmation email has been sent to your inbox.'
		);
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error resending confirmation email:', error);
		req.flash('error', 'Something went wrong. Please try again later.');
		res.redirect('/?auth=true');
	}
};
