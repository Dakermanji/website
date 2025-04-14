//! middlewares/errorHandler.js

import Sentry from '../config/instrument.js';
import env from '../config/dotenv.js';

const errorHandler = (err, req, res, next) => {
	// Send the error to Sentry
	Sentry.captureException(err);
	console.error(err);

	const statusCode = err.status || 500;
	const message =
		env.NODE_ENV === 'development'
			? err.message || 'An unexpected error occurred.'
			: 'Internal Server Error';

	// 💡 Respond with JSON if it's an API or AJAX request
	if (req.xhr || req.headers.accept.includes('application/json')) {
		return res.status(statusCode).json({ error: message });
	}

	// Default HTML/web response
	req.flash('error', message);
	res.status(statusCode).send(message);
};

export default errorHandler;
