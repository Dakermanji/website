import validator from 'validator';

const disallowedChars = /[^a-zA-Z0-9 .,?!]/; // Adjust as needed
export const sanitizeForm = (req, res, next) => {
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
