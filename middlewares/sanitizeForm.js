//! middlewares/sanitizeForm.js

import validator from 'validator';

export const sanitizeMessageForm = (req, res, next) => {
	const { subject, message } = req.body;

	// Sanitize inputs
	req.body.subject = validator.escape(validator.trim(subject || ''));
	req.body.message = validator.escape(validator.trim(message || ''));

	// Validate inputs
	if (validator.isEmpty(req.body.subject) || req.body.subject.length > 100) {
		req.flash(
			'error',
			'Subject is required and must be under 100 characters.'
		);
		return res.redirect('/#contact');
	}

	if (validator.isEmpty(req.body.message) || req.body.message.length > 1000) {
		req.flash(
			'error',
			'Message is required and must be under 1000 characters.'
		);
		return res.redirect('/#contact');
	}

	next();
};

export const sanitizeLoginForm = (req, res, next) => {
	const { email, password } = req.body;

	// Trim and escape inputs
	req.body.email = validator.normalizeEmail(email || '', {
		gmail_remove_dots: false,
	});
	req.body.password = validator.trim(password || '');
	// Validate inputs
	if (!validator.isEmail(req.body.email)) {
		req.flash('error', 'Invalid email address.');
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

	// Trim and escape inputs
	req.body.username = validator.escape(validator.trim(username || ''));
	req.body.email = validator.normalizeEmail(email || '', {
		gmail_remove_dots: false,
	});
	req.body.password = validator.trim(password || '');
	req.body.confirmPassword = validator.trim(confirmPassword || '');

	// Validate inputs
	if (validator.isEmpty(req.body.username) || req.body.username.length < 3) {
		req.flash('error', 'Username must be at least 3 characters long.');
		return res.redirect('/?auth=true');
	}

	if (!/^[A-Za-z0-9_.-]+$/.test(req.body.username)) {
		req.flash(
			'error',
			'Username can only contain letters, numbers, underscores, dots, and hyphens.'
		);
		return res.redirect('/?auth=true');
	}

	if (!validator.isEmail(req.body.email)) {
		req.flash('error', 'Invalid email address.');
		return res.redirect('/?auth=true');
	}

	// Password strength validation
	const passwordStrengthRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+])[A-Za-z\d!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+]{8,}$/;

	if (!passwordStrengthRegex.test(req.body.password)) {
		req.flash(
			'error',
			'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
		);
		return res.redirect('/?auth=true');
	}

	if (req.body.password !== req.body.confirmPassword) {
		req.flash('error', 'Passwords do not match.');
		return res.redirect('/?auth=true');
	}

	next();
};
