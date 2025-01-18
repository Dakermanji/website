//! middlewares/sanitizeForm.js

import validator from 'validator';

const disallowedChars = /[^a-zA-Z0-9 .,?!]/; // Adjust as needed
export const sanitizeMessageForm = (req, res, next) => {
	try {
		// Trim and sanitize inputs
		let { name, email, message } = req.body;

		name = validator.escape(validator.trim(name || ''));
		email = validator.normalizeEmail(email || '');
		message = validator.escape(validator.trim(message || ''));

		// Validate input lengths
		if (name.length > 100 || email.length > 100 || message.length > 1000) {
			req.flash('error', 'Input exceeds allowed length.');
			return res.redirect('/#flash-message');
		}
		if (!validator.isEmail(email)) {
			req.flash('error', 'Invalid email address.');
			return res.redirect('/#flash-message');
		}
		if (disallowedChars.test(message)) {
			req.flash('error', 'Your message contains invalid characters.');
			return res.redirect('/#flash-message');
		}

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.error('Error sanitizing form data:', error);
		next(error);
	}
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
