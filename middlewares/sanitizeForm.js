import validator from 'validator';

export const sanitizeForm = (req, res, next) => {
	try {
		// Trim and sanitize inputs
		req.body.name = validator.escape(validator.trim(req.body.name || ''));
		req.body.email = validator.normalizeEmail(req.body.email || '');
		req.body.message = validator.escape(
			validator.trim(req.body.message || '')
		);

		// Validate input lengths
		if (
			req.body.name.length > 100 ||
			req.body.email.length > 100 ||
			req.body.message.length > 1000
		) {
			req.flash('error', 'Input exceeds allowed length.');
			return res.redirect('/');
		}

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.error('Error sanitizing form data:', error);
		next(error);
	}
};
