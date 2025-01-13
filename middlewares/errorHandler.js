//! middlewares/errorHandler.js

import Sentry from '../config/instrument.js';
import env from '../config/dotenv.js';
const errorHandler = (err, req, res, next) => {
	// Send the error to Sentry
	Sentry.captureException(err);

	const statusCode = err.status || 500;
	const message =
		env.NODE_ENV === 'development'
			? err.message || 'An unexpected error occurred.'
			: 'Internal Server Error';

	res.status(statusCode).send(message);
};

export default errorHandler;
