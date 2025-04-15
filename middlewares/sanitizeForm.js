//! middlewares/sanitizeForm.js

import validator from 'validator';
import {
	validateSubject,
	validateMessage,
	validateEmail,
	validateUsername,
	validatePassword,
} from '../utils/formValidator.js';

/**
 * Sanitizes and trims input data to ensure clean and safe data.
 * @param {string} input - The raw user input.
 * @param {object} [options] - Additional options for sanitization.
 * @returns {string} The sanitized input.
 */
export const sanitizeInput = (
	input,
	options = { escape: true, trim: true }
) => {
	let sanitized = input;

	if (options.trim) {
		sanitized = validator.trim(sanitized);
	}
	if (options.escape) {
		sanitized = validator.escape(sanitized);
	}

	return sanitized;
};

// Existing functions for sanitizing forms

export const sanitizeMessageForm = (req, res, next) => {
	const { subject, message } = req.body;
	req.body.subject = sanitizeInput(subject);
	req.body.message = sanitizeInput(message);

	const subjectError = validateSubject(req.body.subject);
	const messageError = validateMessage(req.body.message);

	if (subjectError) {
		req.flash('error', subjectError);
		return res.redirect('/#contact');
	}
	if (messageError) {
		req.flash('error', messageError);
		return res.redirect('/#contact');
	}

	next();
};

export const sanitizeLoginForm = (req, res, next) => {
	const { email, password } = req.body;
	req.body.email = validator.normalizeEmail(email || '', {
		gmail_remove_dots: false,
	});
	req.body.password = sanitizeInput(password);

	const emailError = validateEmail(req.body.email);
	if (emailError) {
		req.flash('error', emailError);
		return res.redirect('/?auth=true');
	}

	if (validator.isEmpty(req.body.password)) {
		req.flash('error', 'Password cannot be empty.');
		return res.redirect('/?auth=true');
	}

	next();
};

export const sanitizeRegisterForm = (req, res, next) => {
	const { username, email, password, confirmPassword } = req.body;

	req.body.username = sanitizeInput(username);
	req.body.email = validator.normalizeEmail(email || '', {
		gmail_remove_dots: false,
	});
	req.body.password = sanitizeInput(password, { escape: false });
	req.body.confirmPassword = sanitizeInput(confirmPassword, {
		escape: false,
	});

	const usernameError = validateUsername(req.body.username);
	if (usernameError) {
		req.flash('error', usernameError);
		return res.redirect('/?auth=true');
	}

	const emailError = validateEmail(req.body.email);
	if (emailError) {
		req.flash('error', emailError);
		return res.redirect('/?auth=true');
	}

	const passwordError = validatePassword(req.body.password);
	if (passwordError) {
		req.flash('error', passwordError);
		return res.redirect('/?auth=true');
	}

	if (req.body.password !== req.body.confirmPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('/?auth=true');
	}

	next();
};
